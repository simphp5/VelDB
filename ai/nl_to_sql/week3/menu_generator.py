def generate_menus(domain: str) -> list[str]:
    """
    Generates a suggested list of dashboard menus based on the detected domain.
    Focuses only on the retail domain.
    """
    if domain == "retail":
        return [
            "Sales Overview",
            "Top Products",
            "Customer Insights",
            "Inventory Status",
            "Order Trends",
            "Revenue Summary"
        ]
    return []
