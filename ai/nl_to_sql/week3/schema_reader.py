import os
import sqlite3
from typing import Any, Dict, List, Tuple

try:
    import psycopg2
    import psycopg2.extras
except ImportError:  # pragma: no cover - handled when Postgres not available
    psycopg2 = None


class SchemaReaderError(Exception):
    """Raised when the schema cannot be collected."""


class SchemaReader:
    def __init__(
        self,
        pg_dsn: str = None,
        sqlite_path: str = None,
        schema_name: str = "public",
    ):
        self.pg_dsn = pg_dsn or os.environ.get("VELDB_PG_DSN")
        self.sqlite_path = sqlite_path or os.environ.get("VELDB_SQLITE_PATH", "veldb_test.db")
        self.schema_name = schema_name

    def get_schema_info(self) -> Dict[str, Any]:
        """
        Returns both a structured representation of the schema and a
        human-readable block suitable for injecting into LLM prompts.
        """
        schema_dict, source = self._read_schema()
        if not schema_dict:
            raise SchemaReaderError("No tables were detected in the target database.")
        formatted = self._format_schema_for_prompt(schema_dict)
        return {"tables": schema_dict, "prompt": formatted, "source": source}

    def _read_schema(self) -> Tuple[Dict[str, Any], str]:
        if self.pg_dsn:
            return self._read_postgres_schema(), "PostgreSQL"
        return self._read_sqlite_schema(), "SQLite (fallback)"

    def _read_postgres_schema(self) -> Dict[str, Any]:
        if psycopg2 is None:
            raise SchemaReaderError("Install psycopg2-binary to read the PostgreSQL schema.")

        try:
            with psycopg2.connect(self.pg_dsn, cursor_factory=psycopg2.extras.RealDictCursor) as conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        """
                        SELECT table_name
                        FROM information_schema.tables
                        WHERE table_schema = %(schema)s
                          AND table_type = 'BASE TABLE'
                        ORDER BY table_name;
                        """,
                        {"schema": self.schema_name},
                    )
                    tables = [row["table_name"] for row in cursor.fetchall()]

                    schema: Dict[str, Any] = {}

                    for table in tables:
                        cursor.execute(
                            """
                            SELECT column_name, data_type, is_nullable, column_default
                            FROM information_schema.columns
                            WHERE table_schema = %(schema)s
                              AND table_name = %(table)s
                            ORDER BY ordinal_position;
                            """,
                            {"schema": self.schema_name, "table": table},
                        )
                        columns = cursor.fetchall()
                        schema[table] = self._build_table_metadata(columns)

                    return schema
        except psycopg2.Error as exc:
            raise SchemaReaderError(f"PostgreSQL schema read failed: {exc}") from exc

    def _read_sqlite_schema(self) -> Dict[str, Any]:
        try:
            conn = sqlite3.connect(self.sqlite_path)
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
            tables = [row[0] for row in cursor.fetchall()]

            schema: Dict[str, Any] = {}
            for table in tables:
                cursor.execute(f"PRAGMA table_info('{table}');")
                columns = cursor.fetchall()
                schema[table] = self._build_table_metadata(columns, sqlite=True)

            conn.close()
            return schema
        except sqlite3.Error as exc:
            raise SchemaReaderError(f"SQLite schema read failed: {exc}") from exc

    def _build_table_metadata(self, columns: List[Dict[str, Any]], sqlite: bool = False) -> Dict[str, Any]:
        column_names: List[str] = []
        column_types: List[str] = []
        column_details: List[str] = []

        for col in columns:
            if sqlite:
                name, data_type, not_null, default, pk = col[1], col[2], col[3], col[4], col[5]
                nullable = "NOT NULL" if not_null else "NULL"
                default_part = f" DEFAULT {default}" if default is not None else ""
                pk_part = " PRIMARY KEY" if pk else ""
                dtype = data_type or "TEXT"
                detail = f"{name} {dtype}{pk_part}{default_part}"
            else:
                name = col["column_name"]
                dtype = col["data_type"]
                nullable = "(nullable)" if col["is_nullable"] == "YES" else "(required)"
                default_part = f" DEFAULT {col['column_default']}" if col["column_default"] else ""
                detail = f"{name} {dtype}{default_part} {nullable}"

            column_names.append(name)
            column_types.append(dtype)
            column_details.append(detail.strip())

        return {"columns": column_names, "types": column_types, "details": column_details}

    def _format_schema_for_prompt(self, schema: Dict[str, Any]) -> str:
        lines: List[str] = []
        for table, meta in schema.items():
            lines.append(f"Table: {table}")
            for detail in meta.get("details", []):
                lines.append(f"  - {detail}")
            lines.append("")
        return "\n".join(lines).strip()


if __name__ == "__main__":
    reader = SchemaReader()
    info = reader.get_schema_info()
    print("Extracted Schema:")
    print(info["prompt"])
