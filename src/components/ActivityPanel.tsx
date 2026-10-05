type ActivityPanelProps = {
  agentLocation: string
}

function ActivityPanel({
  agentLocation,
}: ActivityPanelProps) {
  return (
    <section className="panel activity-panel">
      <div className="panel-title">ACTIVITY</div>

      <div className="activity">
        <div>
          <span className="activity-dot complete" />

          <div>
            <strong>Agent initialized</strong>
            <span>{agentLocation}</span>
          </div>
        </div>

        <div>
          <span className="activity-dot" />

          <div>
            <strong>Waiting for command</strong>
            <span>Ready</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ActivityPanel