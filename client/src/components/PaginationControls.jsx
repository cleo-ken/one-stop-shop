import PropTypes from 'prop-types';

function PaginationControls({
  page,
  totalPages,
  total,
  pageSize,
  currentCount,
  onPageChange,
  onPageSizeChange
}) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = total === 0 ? 0 : Math.min(total, start + currentCount - 1);
  const disablePrev = page <= 1;
  const disableNext = page >= totalPages || total === 0;

  return (
    <div className="pagination-controls">
      <div className="page-info">
        {total === 0 ? 'No titles to display' : `Showing ${start}–${end} of ${total.toLocaleString()} titles`}
      </div>
      <div className="page-actions">
        <label htmlFor="page-size">Page size</label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          {[20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
        <div className="page-buttons">
          <button type="button" onClick={() => onPageChange(1)} disabled={disablePrev}>
            « First
          </button>
          <button type="button" onClick={() => onPageChange(page - 1)} disabled={disablePrev}>
            ‹ Prev
          </button>
          <span>
            Page {totalPages === 0 ? 0 : page} / {totalPages}
          </span>
          <button type="button" onClick={() => onPageChange(page + 1)} disabled={disableNext}>
            Next ›
          </button>
          <button type="button" onClick={() => onPageChange(totalPages)} disabled={disableNext}>
            Last »
          </button>
        </div>
      </div>
    </div>
  );
}

PaginationControls.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired
};

export default PaginationControls;
