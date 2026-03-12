"""
Historical data for oil prices (WTI crude, USD/barrel) and US personal savings rates (%).

Data covers annual averages from 2000 to 2023, sourced from publicly available
EIA (Energy Information Administration) and Federal Reserve Economic Data (FRED) records.
"""

import pandas as pd

# Annual average WTI crude oil prices (USD per barrel)
# Source: U.S. Energy Information Administration (EIA)
OIL_PRICES = {
    2000: 30.38,
    2001: 25.98,
    2002: 26.18,
    2003: 31.08,
    2004: 41.51,
    2005: 56.64,
    2006: 66.05,
    2007: 72.34,
    2008: 99.67,
    2009: 61.95,
    2010: 79.48,
    2011: 94.88,
    2012: 94.05,
    2013: 97.98,
    2014: 93.17,
    2015: 48.66,
    2016: 43.29,
    2017: 50.80,
    2018: 65.23,
    2019: 57.04,
    2020: 41.47,
    2021: 68.14,
    2022: 94.53,
    2023: 77.61,
}

# Annual average US personal savings rate (% of disposable personal income)
# Source: U.S. Bureau of Economic Analysis via FRED
SAVINGS_RATES = {
    2000: 5.0,
    2001: 5.4,
    2002: 5.6,
    2003: 5.5,
    2004: 5.1,
    2005: 2.3,
    2006: 3.0,
    2007: 3.7,
    2008: 5.4,
    2009: 5.9,
    2010: 5.5,
    2011: 5.5,
    2012: 7.3,
    2013: 5.7,
    2014: 5.6,
    2015: 6.2,
    2016: 5.7,
    2017: 4.9,
    2018: 7.5,
    2019: 7.5,
    2020: 16.8,
    2021: 12.0,
    2022: 3.3,
    2023: 4.6,
}


def load_data() -> pd.DataFrame:
    """
    Load and return a DataFrame with oil prices and savings rates.

    Returns
    -------
    pd.DataFrame
        DataFrame indexed by year with columns 'oil_price' (USD/barrel)
        and 'savings_rate' (% of disposable personal income).
    """
    df = pd.DataFrame(
        {
            "oil_price": OIL_PRICES,
            "savings_rate": SAVINGS_RATES,
        }
    )
    df.index.name = "year"
    return df
