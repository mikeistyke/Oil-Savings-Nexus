"""
Oil Savings Nexus — Main analysis script.

Runs the full oil-to-savings correlation analysis:
  1. Loads historical WTI oil price and US personal savings rate data.
  2. Computes Pearson and Spearman correlations.
  3. Generates three charts saved to the ``output/`` directory:
       - time_series.png  : dual-axis time series
       - scatter.png      : scatter plot with linear trend
       - rolling_corr.png : 5-year rolling correlation
  4. Prints a summary to stdout.
"""

from src.correlation import compute_correlation, rolling_correlation
from src.data import load_data
from src.visualization import plot_rolling_correlation, plot_scatter, plot_time_series

ROLLING_WINDOW = 5
OUTPUT_DIR = "output"


def run_analysis(show_plots: bool = False) -> None:
    """Execute the complete oil-to-savings correlation analysis."""
    print("=" * 60)
    print("  Oil-to-Savings Correlation Analysis")
    print("=" * 60)

    # Load data
    df = load_data()
    print(f"\nData loaded: {len(df)} annual observations ({df.index[0]}–{df.index[-1]})\n")
    print(df.to_string())

    # Compute correlations
    result = compute_correlation(df)
    print("\n--- Correlation Results ---")
    print(result.interpretation)
    print(f"\nPearson  r = {result.pearson_r:+.4f}  (p = {result.pearson_p:.4f})")
    print(f"Spearman ρ = {result.spearman_r:+.4f}  (p = {result.spearman_p:.4f})")

    # Rolling correlation
    rolling = rolling_correlation(df, window=ROLLING_WINDOW)
    print(f"\n--- {ROLLING_WINDOW}-Year Rolling Pearson Correlation ---")
    print(rolling.dropna().to_string())

    # Charts
    print("\nGenerating charts …")
    plot_time_series(
        df,
        save_path=f"{OUTPUT_DIR}/time_series.png",
        show=show_plots,
    )
    plot_scatter(
        df,
        result,
        save_path=f"{OUTPUT_DIR}/scatter.png",
        show=show_plots,
    )
    plot_rolling_correlation(
        rolling,
        window=ROLLING_WINDOW,
        save_path=f"{OUTPUT_DIR}/rolling_corr.png",
        show=show_plots,
    )
    print(f"Charts saved to '{OUTPUT_DIR}/'")
    print("\nDone.")


if __name__ == "__main__":
    run_analysis(show_plots=False)
