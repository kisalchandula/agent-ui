type FooterProps = {
  floor: number
}

function Footer({ floor }: FooterProps) {
  return (
    <footer>
      Spatial Agent
      <span>•</span>
      Building Model
      <span>•</span>
      Floor {floor}
    </footer>
  )
}

export default Footer