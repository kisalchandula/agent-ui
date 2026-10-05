type CommandPanelProps = {
  command: string
  onCommandChange: (value: string) => void
  onSubmit: () => void
}

function CommandPanel({
  command,
  onCommandChange,
  onSubmit,
}: CommandPanelProps) {
  return (
    <section className="panel">
      <div className="panel-title">COMMAND</div>

      <div className="command">
        <input
          type="text"
          placeholder="Ask the agent..."
          value={command}
          onChange={(event) =>
            onCommandChange(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSubmit()
            }
          }}
        />

        <button onClick={onSubmit}>→</button>
      </div>
    </section>
  )
}

export default CommandPanel