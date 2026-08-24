// A grid of pill buttons for choosing a product variant (shade, color,
// etc). Unavailable shades show with a strikethrough and can't be
// selected - same idea as the reference screenshot, restyled with our
// own pink/black palette instead of copying its colors.
function ShadeSelector({ shades, selectedShade, onSelect }) {
  return (
    <div className="shade-selector">
      <span className="shade-selector__label">Shade: {selectedShade}</span>
      <div className="shade-selector__options" role="group" aria-label="Choose a shade">
        {shades.map((shade) => {
          const isSelected = shade.name === selectedShade;
          return (
            <button
              key={shade.name}
              type="button"
              className={
                isSelected
                  ? "shade-pill shade-pill--selected"
                  : shade.available
                  ? "shade-pill"
                  : "shade-pill shade-pill--unavailable"
              }
              disabled={!shade.available}
              aria-pressed={isSelected}
              onClick={() => onSelect(shade.name)}
            >
              {shade.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ShadeSelector;
