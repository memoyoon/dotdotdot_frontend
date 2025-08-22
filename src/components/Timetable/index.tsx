type Item = { id: string; preview: string };

function HourBlock({ hour, items }: { hour: string; items: Item[] }) {
  return (
    <section className="hour-block">
      <h3>{hour}</h3>
      <ul>
        {items.map((n) => (
          <li key={n.id}>{n.preview}</li>
        ))}
      </ul>
    </section>
  );
}

export default HourBlock;