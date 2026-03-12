"""Tests for the correlation analysis module."""

import pandas as pd
import pytest

from src.correlation import CorrelationResult, compute_correlation, rolling_correlation


@pytest.fixture
def sample_df():
    """Small DataFrame with a known positive correlation."""
    return pd.DataFrame(
        {
            "oil_price": [30.0, 50.0, 70.0, 90.0, 110.0],
            "savings_rate": [4.0, 5.0, 6.0, 7.0, 8.0],
        },
        index=[2000, 2001, 2002, 2003, 2004],
    )


@pytest.fixture
def sample_df_negative():
    """Small DataFrame with a known negative correlation."""
    return pd.DataFrame(
        {
            "oil_price": [30.0, 50.0, 70.0, 90.0, 110.0],
            "savings_rate": [8.0, 7.0, 6.0, 5.0, 4.0],
        },
        index=[2000, 2001, 2002, 2003, 2004],
    )


class TestComputeCorrelation:
    def test_returns_named_tuple(self, sample_df):
        result = compute_correlation(sample_df)
        assert isinstance(result, CorrelationResult)

    def test_pearson_positive_correlation(self, sample_df):
        result = compute_correlation(sample_df)
        assert result.pearson_r == pytest.approx(1.0, abs=1e-9)

    def test_spearman_positive_correlation(self, sample_df):
        result = compute_correlation(sample_df)
        assert result.spearman_r == pytest.approx(1.0, abs=1e-9)

    def test_pearson_negative_correlation(self, sample_df_negative):
        result = compute_correlation(sample_df_negative)
        assert result.pearson_r == pytest.approx(-1.0, abs=1e-9)

    def test_spearman_negative_correlation(self, sample_df_negative):
        result = compute_correlation(sample_df_negative)
        assert result.spearman_r == pytest.approx(-1.0, abs=1e-9)

    def test_p_values_are_floats(self, sample_df):
        result = compute_correlation(sample_df)
        assert isinstance(result.pearson_p, float)
        assert isinstance(result.spearman_p, float)

    def test_interpretation_is_string(self, sample_df):
        result = compute_correlation(sample_df)
        assert isinstance(result.interpretation, str)
        assert len(result.interpretation) > 0

    def test_interpretation_contains_pearson(self, sample_df):
        result = compute_correlation(sample_df)
        assert "Pearson" in result.interpretation

    def test_interpretation_contains_spearman(self, sample_df):
        result = compute_correlation(sample_df)
        assert "Spearman" in result.interpretation

    def test_missing_column_raises(self, sample_df):
        with pytest.raises(ValueError, match="missing required columns"):
            compute_correlation(sample_df.drop(columns=["savings_rate"]))

    def test_too_few_rows_raises(self):
        small_df = pd.DataFrame(
            {"oil_price": [30.0, 50.0], "savings_rate": [4.0, 5.0]},
            index=[2000, 2001],
        )
        with pytest.raises(ValueError, match="At least 3 observations"):
            compute_correlation(small_df)

    def test_with_nan_drops_rows(self):
        df = pd.DataFrame(
            {
                "oil_price": [30.0, None, 70.0, 90.0, 110.0],
                "savings_rate": [4.0, 5.0, None, 7.0, 8.0],
            },
            index=[2000, 2001, 2002, 2003, 2004],
        )
        result = compute_correlation(df)
        # Should succeed using the 3 complete rows (2000, 2003, 2004)
        assert isinstance(result, CorrelationResult)

    def test_r_values_in_range(self, sample_df):
        result = compute_correlation(sample_df)
        assert -1.0 <= result.pearson_r <= 1.0
        assert -1.0 <= result.spearman_r <= 1.0


class TestRollingCorrelation:
    def test_returns_series(self, sample_df):
        result = rolling_correlation(sample_df, window=3)
        assert isinstance(result, pd.Series)

    def test_series_name(self, sample_df):
        result = rolling_correlation(sample_df, window=3)
        assert result.name == "rolling_correlation"

    def test_first_values_are_nan(self, sample_df):
        result = rolling_correlation(sample_df, window=3)
        # First (window - 1) values should be NaN
        assert result.iloc[0:2].isna().all()

    def test_non_nan_values_in_range(self, sample_df):
        result = rolling_correlation(sample_df, window=3)
        valid = result.dropna()
        # Allow floating-point deviation beyond ±1 (scipy can return values like 1.0000000000000029)
        assert valid.between(-1.0 - 1e-6, 1.0 + 1e-6).all()

    def test_window_too_small_raises(self, sample_df):
        with pytest.raises(ValueError, match="at least 3"):
            rolling_correlation(sample_df, window=2)

    def test_missing_column_raises(self, sample_df):
        with pytest.raises(ValueError, match="missing required columns"):
            rolling_correlation(sample_df.drop(columns=["oil_price"]))

    def test_window_default_is_5(self, sample_df):
        # Extend sample to 6 rows so window=5 produces at least one valid value
        big_df = pd.DataFrame(
            {
                "oil_price": [30.0, 50.0, 70.0, 90.0, 110.0, 130.0],
                "savings_rate": [4.0, 5.0, 6.0, 7.0, 8.0, 9.0],
            },
            index=[2000, 2001, 2002, 2003, 2004, 2005],
        )
        result = rolling_correlation(big_df)
        assert result.dropna().shape[0] == 2  # rows 2004 and 2005
