"""
Correlation analysis between oil prices and personal savings rates.

Provides functions to compute Pearson and Spearman correlation coefficients
and to summarise the direction and strength of the relationship.
"""

from typing import NamedTuple

import numpy as np
import pandas as pd
from scipy import stats


class CorrelationResult(NamedTuple):
    """Container for correlation analysis results."""

    pearson_r: float
    pearson_p: float
    spearman_r: float
    spearman_p: float
    interpretation: str


def _interpret(r: float, p: float, method: str = "Pearson") -> str:
    """Return a human-readable interpretation of a correlation coefficient."""
    if p >= 0.05:
        significance = "not statistically significant (p ≥ 0.05)"
    elif p >= 0.01:
        significance = "statistically significant (p < 0.05)"
    else:
        significance = "highly statistically significant (p < 0.01)"

    abs_r = abs(r)
    if abs_r < 0.2:
        strength = "negligible"
    elif abs_r < 0.4:
        strength = "weak"
    elif abs_r < 0.6:
        strength = "moderate"
    elif abs_r < 0.8:
        strength = "strong"
    else:
        strength = "very strong"

    direction = "positive" if r >= 0 else "negative"
    return (
        f"{method} r = {r:.3f} — {strength} {direction} correlation, {significance}."
    )


def compute_correlation(df: pd.DataFrame) -> CorrelationResult:
    """
    Compute Pearson and Spearman correlations between oil prices and savings rates.

    Parameters
    ----------
    df : pd.DataFrame
        DataFrame with columns 'oil_price' and 'savings_rate'.

    Returns
    -------
    CorrelationResult
        Named tuple containing correlation coefficients, p-values, and an
        interpretation string.

    Raises
    ------
    ValueError
        If required columns are missing or there are fewer than 3 observations.
    """
    required = {"oil_price", "savings_rate"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"DataFrame is missing required columns: {missing}")

    clean = df[["oil_price", "savings_rate"]].dropna()
    if len(clean) < 3:
        raise ValueError(
            "At least 3 observations are required to compute correlations."
        )

    oil = clean["oil_price"].to_numpy(dtype=float)
    savings = clean["savings_rate"].to_numpy(dtype=float)

    pearson_r, pearson_p = stats.pearsonr(oil, savings)
    spearman_r, spearman_p = stats.spearmanr(oil, savings)

    interpretation = (
        _interpret(pearson_r, pearson_p, "Pearson")
        + "\n"
        + _interpret(spearman_r, spearman_p, "Spearman")
    )

    return CorrelationResult(
        pearson_r=float(pearson_r),
        pearson_p=float(pearson_p),
        spearman_r=float(spearman_r),
        spearman_p=float(spearman_p),
        interpretation=interpretation,
    )


def rolling_correlation(df: pd.DataFrame, window: int = 5) -> pd.Series:
    """
    Compute a rolling Pearson correlation between oil prices and savings rates.

    Parameters
    ----------
    df : pd.DataFrame
        DataFrame with columns 'oil_price' and 'savings_rate'.
    window : int
        Rolling window size in years (must be >= 3).

    Returns
    -------
    pd.Series
        Rolling correlation values indexed by year.

    Raises
    ------
    ValueError
        If the window is less than 3 or required columns are missing.
    """
    if window < 3:
        raise ValueError("Rolling window must be at least 3.")

    required = {"oil_price", "savings_rate"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"DataFrame is missing required columns: {missing}")

    return (
        df["oil_price"]
        .rolling(window)
        .corr(df["savings_rate"])
        .rename("rolling_correlation")
    )
