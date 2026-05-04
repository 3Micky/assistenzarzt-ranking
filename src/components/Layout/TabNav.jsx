/**
 * @param {{ tabs: {id:string, label:string}[], active: string, onChange: (id:string)=>void }} props
 */
export default function TabNav({ tabs, active, onChange }) {
  return (
    <div className="ink-grid border-b border-ink" style={{ gridTemplateColumns: `repeat(${tabs.length}, auto) 1fr` }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={active === tab.id ? 'tab-active' : 'tab-inactive'}
        >
          {tab.label}
        </button>
      ))}
      {/* Filler cell */}
      <div className="bg-canvas" />
    </div>
  )
}
