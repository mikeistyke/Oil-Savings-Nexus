"""
Visualization utilities for oil price and savings rate correlation analysis.

All plotting functions accept a ``save_path`` argument; when provided the
figure is saved to disk instead of (or as well as) being displayed.
"""

from pathlib import Path
from typing import Optional

import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import numpy as np
import pandas as pd

from src.correlation import CorrelationResult


def _apply_style(ax: plt.Axes) -> None:
    """Apply a consistent, clean style to an axes object."""
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.grid(axis="y", linestyle="--", alpha=0.4)


def plot_time_series(
    df: pd.DataFrame,
    save_path: Optional[str] = None,
    show: bool = True,
) -> plt.Figure:
    """
    Plot oil prices and savings rates on a dual-axis time series chart.

    Parameters
    ----------
    df : pd.DataFrame
        DataFrame indexed by year with columns 'oil_price' and 'savings_rate'.
    save_path : str, optional
        File path to save the figure (e.g. 'output/time_series.png').
    show : bool
        Whether to call ``plt.show()``; set to False in non-interactive contexts.

    Returns
    -------
    plt.Figure
    """
    fig, ax1 = plt.subplots(figsize=(12, 5))

    color_oil = "#d62728"
    color_savings = "#1f77b4"

    ax1.set_xlabel("Year", fontsize=11)
    ax1.set_ylabel("WTI Crude Oil Price (USD / barrel)", color=color_oil, fontsize=11)
    ax1.plot(
        df.index, df["oil_price"], color=color_oil, linewidth=2, marker="o", ms=4,
        label="Oil Price"
    )
    ax1.tick_params(axis="y", labelcolor=color_oil)
    ax1.yaxis.set_major_formatter(mticker.FormatStrFormatter("$%.0f"))
    _apply_style(ax1)

    ax2 = ax1.twinx()
    ax2.set_ylabel("US Personal Savings Rate (%)", color=color_savings, fontsize=11)
    ax2.plot(
        df.index, df["savings_rate"], color=color_savings, linewidth=2,
        linestyle="--", marker="s", ms=4, label="Savings Rate"
    )
    ax2.tick_params(axis="y", labelcolor=color_savings)
    ax2.yaxis.set_major_formatter(mticker.FormatStrFormatter("%.1f%%"))
    ax2.spines["top"].set_visible(False)

    lines1, labels1 = ax1.get_legend_handles_labels()
    lines2, labels2 = ax2.get_legend_handles_labels()
    ax1.legend(lines1 + lines2, labels1 + labels2, loc="upper left", fontsize=10)

    fig.suptitle(
        "WTI Crude Oil Price vs US Personal Savings Rate (2000–2023)",
        fontsize=13,
        fontweight="bold",
    )
    fig.tight_layout()

    if save_path:
        Path(save_path).parent.mkdir(parents=True, exist_ok=True)
        fig.savefig(save_path, dpi=150, bbox_inches="tight")

    if show:
        plt.show()

    return fig


def plot_scatter(
    df: pd.DataFrame,
    result: CorrelationResult,
    save_path: Optional[str] = None,
    show: bool = True,
) -> plt.Figure:
    """
    Scatter plot of oil prices vs savings rates with a linear regression line.

    Parameters
    ----------
    df : pd.DataFrame
        DataFrame with columns 'oil_price' and 'savings_rate'.
    result : CorrelationResult
        Pre-computed correlation result used to annotate the chart.
    save_path : str, optional
        File path to save the figure.
    show : bool
        Whether to call ``plt.show()``.

    Returns
    -------
    plt.Figure
    """
    clean = df[["oil_price", "savings_rate"]].dropna()
    oil = clean["oil_price"].to_numpy(dtype=float)
    savings = clean["savings_rate"].to_numpy(dtype=float)

    m, b = np.polyfit(oil, savings, 1)
    x_line = np.linspace(oil.min(), oil.max(), 200)

    fig, ax = plt.subplots(figsize=(8, 6))

    sc = ax.scatter(
        oil, savings, c=clean.index, cmap="viridis", s=60, zorder=3,
        label="Annual observation"
    )
    ax.plot(x_line, m * x_line + b, color="red", linewidth=1.5,
            linestyle="--", label="Linear trend")

    cbar = fig.colorbar(sc, ax=ax, pad=0.02)
    cbar.set_label("Year", fontsize=10)

    ax.set_xlabel("WTI Crude Oil Price (USD / barrel)", fontsize=11)
    ax.set_ylabel("US Personal Savings Rate (%)", fontsize=11)
    ax.set_title(
        "Oil Price vs Savings Rate Scatter\n"
        f"Pearson r = {result.pearson_r:.3f}  |  Spearman ρ = {result.spearman_r:.3f}",
        fontsize=12,
    )
    ax.legend(fontsize=10)
    _apply_style(ax)
    fig.tight_layout()

    if save_path:
        Path(save_path).parent.mkdir(parents=True, exist_ok=True)
        fig.savefig(save_path, dpi=150, bbox_inches="tight")

    if show:
        plt.show()

    return fig


def plot_rolling_correlation(
    rolling: pd.Series,
    window: int,
    save_path: Optional[str] = None,
    show: bool = True,
) -> plt.Figure:
    """
    Plot the rolling Pearson correlation over time.

    Parameters
    ----------
    rolling : pd.Series
        Rolling correlation values indexed by year.
    window : int
        Window size used, displayed in the chart title.
    save_path : str, optional
        File path to save the figure.
    show : bool
        Whether to call ``plt.show()``.

    Returns
    -------
    plt.Figure
    """
    fig, ax = plt.subplots(figsize=(10, 4))

    ax.plot(rolling.index, rolling.values, color="#2ca02c", linewidth=2, marker="o",
            ms=4)
    ax.axhline(0, color="black", linewidth=0.8, linestyle=":")
    ax.fill_between(rolling.index, rolling.values, 0, alpha=0.15, color="#2ca02c")

    ax.set_xlabel("Year", fontsize=11)
    ax.set_ylabel("Pearson r", fontsize=11)
    ax.set_title(
        f"{window}-Year Rolling Correlation: Oil Price vs Savings Rate",
        fontsize=12,
        fontweight="bold",
    )
    ax.set_ylim(-1.05, 1.05)
    _apply_style(ax)
    fig.tight_layout()

    if save_path:
        Path(save_path).parent.mkdir(parents=True, exist_ok=True)
        fig.savefig(save_path, dpi=150, bbox_inches="tight")

    if show:
        plt.show()

    return fig
