const COVERED = new Set(['GA', 'CA', 'TX', 'NY', 'FL']);

// Geographic grid — standard US state layout
const GRID: (string | null)[][] = [
  [null,null,null,null,null,null,null,null,null,'ME'],
  ['WA','MT','ND','MN','WI','MI',null,null,'VT','NH'],
  ['OR','ID','SD','IA','IL','IN','OH','PA','NY','MA'],
  ['CA','NV','NE','MO','KY','WV','VA','NJ','CT','RI'],
  [null,'UT','CO','KS','TN','NC','MD','DE',null,null],
  [null,'AZ','NM','OK','AR','SC','DC',null,null,null],
  [null,null,null,'TX','LA','MS','AL','GA',null,null],
  ['HI',null,'AK',null,null,null,null,'FL',null,null],
];

export default function StateMap() {
  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 1fr)',
        gap: 4,
        width: '100%',
        maxWidth: 440,
        margin: '0 auto',
      }}>
        {GRID.map((row, ri) =>
          row.map((state, ci) => (
            <div key={`${ri}-${ci}`} style={{
              height: 36,
              borderRadius: 5,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.3px',
              background: state
                ? COVERED.has(state) ? '#CC3333' : '#F0EDE8'
                : 'transparent',
              color: state
                ? COVERED.has(state) ? '#fff' : '#8A8E92'
                : 'transparent',
              border: state && !COVERED.has(state) ? '1px solid #E8E5E0' : 'none',
              transition: 'transform 0.15s',
              cursor: state ? 'default' : 'default',
            }}>
              {state ?? ''}
            </div>
          ))
        )}
      </div>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: '#CC3333' }} />
          <span style={{ fontSize: 11, color: '#4A4E52' }}>5 states covered</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: '#F0EDE8', border: '1px solid #E8E5E0' }} />
          <span style={{ fontSize: 11, color: '#8A8E92' }}>Coming soon</span>
        </div>
      </div>
    </div>
  );
}
