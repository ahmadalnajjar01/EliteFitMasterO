import React from "react";
import PropTypes from "prop-types";

// Note: We're not importing from Material Tailwind React
// This redesign uses Tailwind classes directly with your custom colors

export function StatisticsChart({ chart, title, description, footer }) {
  // Custom theme with your colors
  const theme = {
    primary: "#F0BB78", // amber/gold
    background: "#ffffff", // white
    text: "#181818", // black
  };

  // Apply custom theme to chart if it exists
  const themedChart = chart
    ? {
        ...chart,
        options: {
          ...chart.options,
          theme: {
            mode: "light",
          },
          colors: [theme.primary],
          grid: {
            ...chart.options?.grid,
            borderColor: theme.primary,
          },
          xaxis: {
            ...chart.options?.xaxis,
            labels: {
              ...chart.options?.xaxis?.labels,
              style: {
                colors: theme.text,
              },
            },
          },
          yaxis: {
            ...chart.options?.yaxis,
            labels: {
              ...chart.options?.yaxis?.labels,
              style: {
                colors: theme.text,
              },
            },
          },
        },
      }
    : null;

  return (
    <div className="rounded-lg border border-gray-200 shadow-sm bg-white overflow-hidden">
      {/* Chart Header Section */}
      <div className="p-4 bg-white border-b border-gray-100">
        {chart &&
          React.createElement(
            "div",
            {
              style: { background: theme.background },
              className: "w-full h-full",
            },
            React.createElement(Chart, themedChart)
          )}
      </div>

      {/* Card Body */}
      <div className="px-6 py-4">
        <h6
          className="text-lg font-medium text-gray-900"
          style={{ color: theme.text }}
        >
          {title}
        </h6>
        <p className="text-sm font-normal" style={{ color: theme.text }}>
          {description}
        </p>
      </div>

      {/* Optional Footer */}
      {footer && (
        <div
          className="border-t border-gray-100 px-6 py-4"
          style={{ borderColor: `${theme.primary}40` }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

StatisticsChart.defaultProps = {
  footer: null,
};

StatisticsChart.propTypes = {
  chart: PropTypes.object.isRequired,
  title: PropTypes.node.isRequired,
  description: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

StatisticsChart.displayName = "StatisticsChart";

export default StatisticsChart;
