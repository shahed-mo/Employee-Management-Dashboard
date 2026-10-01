import React from 'react';
import '../Components/spinner.css';

const DataTable = ({ title, icon, columns, rows, loading, emptyText = 'No records yet.', rowKey = 'id' }) => (
  <div className="card tabel">
    <div className="card-header items-center">
      {icon}
      <h4 className="card-title">{title}</h4>
    </div>

    <div className="tabel-wrapper">
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.header}>{c.header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '32px' }}>
                <div className="spinner" style={{ margin: 'auto' }} role="status" aria-label="Loading"></div>
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '32px', color: '#717182' }}>
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row[rowKey]} className="table-row">
                {columns.map((c) => (
                  <td
                    key={c.header}
                    className={typeof c.className === 'function' ? c.className(row) : c.className}
                    data-label={c.label || `${c.header}:`}
                  >
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default React.memo(DataTable);