type Location = {
  name: string
  type: string
  x: number
  y: number
  floor: number
}

type Agent = {
  location: string
  status: string
  moving: boolean
}

type AgentPanelProps = {
  agent: Agent
  locations: Location[]
}

function AgentPanel({
  agent,
  locations,
}: AgentPanelProps) {
  const currentLocation = locations.find(
    (location) => location.name === agent.location
  )

  return (
    <section className="panel">
      <div className="panel-title">AGENT</div>

      <div className="agent-name">
        <div className="avatar">A</div>

        <div>
          <strong>Spatial Agent</strong>
          <span>Autonomous agent</span>
        </div>
      </div>

      <div className="info">
        <div>
          <span>Location</span>
          <strong>{agent.location}</strong>
        </div>

        <div>
          <span>Type</span>
          <strong>
            {currentLocation?.type ?? "Unknown"}
          </strong>
        </div>

        <div>
          <span>Floor</span>
          <strong>{currentLocation?.floor ?? 0}</strong>
        </div>

        <div>
          <span>Status</span>
          <strong>{agent.status}</strong>
        </div>
      </div>
    </section>
  )
}

export default AgentPanel