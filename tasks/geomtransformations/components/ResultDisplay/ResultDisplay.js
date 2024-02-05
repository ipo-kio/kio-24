import React from 'react';

export function ResultDisplay({ metrics }) {
  const tableStyle = {
    border: "1px solid black",
    padding: "8px",
    margin: "2px",
    width: "100%",
    textAlign: "center",
    borderCollapse: "collapse"
  };

  const tableDataStyle = {
    border: "1px solid black",
    padding: "2px",
    width: "33%",
    height: "50px"
  };

  return (
    <div style={{fontSize: "20px"}}>
      <h2 style={{textAlign: "center"}}>Результат</h2>
      <table style={tableStyle}>
        <tr>
          <td style={tableDataStyle}><b>S</b></td>
          <td style={tableDataStyle}><b>L</b></td>
          <td style={tableDataStyle}><b>C</b></td>
        </tr>
        <tr>
          <td style={tableDataStyle}>{metrics.similarity.toFixed(3)}</td>
          <td style={tableDataStyle}>{metrics.pathsLength.toFixed(3)}</td>
          <td style={tableDataStyle}>{metrics.cost}</td>
        </tr>
      </table>
    </div>
  );
}
