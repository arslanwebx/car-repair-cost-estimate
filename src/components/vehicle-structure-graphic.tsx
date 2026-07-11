export function VehicleStructureGraphic() {
  return (
    <div className="vehicle-structure">
      <svg viewBox="0 0 680 330" role="img" aria-labelledby="car-structure-title car-structure-desc">
        <title id="car-structure-title">Vehicle body structure and common repair areas</title>
        <desc id="car-structure-desc">A side profile of a sedan with labeled bumper, hood, fender, doors, quarter panel, roof, and trunk areas.</desc>
        <defs>
          <linearGradient id="bodyGradient" x1="0" x2="1">
            <stop offset="0" stopColor="#1769e0" stopOpacity=".26" />
            <stop offset="1" stopColor="#0f9e96" stopOpacity=".18" />
          </linearGradient>
        </defs>

        <g className="vehicle-body">
          <path d="M84 212 107 166c8-17 24-29 43-33l100-22 62-60c13-12 29-18 47-18h79c20 0 39 8 53 22l61 61 65 14c20 4 35 20 38 40l5 42-24 23H97l-26-15 13-28Z" fill="url(#bodyGradient)" />
          <path d="m251 111 72-58c10-8 23-13 36-13h77c16 0 31 6 42 17l56 57Z" />
          <path d="M329 52 308 115M438 41l16 73M251 111l-8 103M534 115l16 99M369 116v98M456 115v99M108 166h100M553 147h76M92 211h118M548 211h105" />
          <path d="M214 215a52 52 0 0 1 104 0M482 215a52 52 0 0 1 104 0" />
          <circle cx="266" cy="218" r="38" />
          <circle cx="534" cy="218" r="38" />
          <circle cx="266" cy="218" r="17" />
          <circle cx="534" cy="218" r="17" />
          <path d="M174 217h40M318 217h164M586 217h51" />
          <path d="M390 135h22M475 135h22" />
        </g>

        <g className="vehicle-callouts">
          <path d="M91 187H36v-31" /><circle cx="91" cy="187" r="4" /><text x="12" y="148">Bumper</text>
          <path d="M177 143v-37h-42" /><circle cx="177" cy="143" r="4" /><text x="81" y="99">Hood</text>
          <path d="M224 175h-92v55" /><circle cx="224" cy="175" r="4" /><text x="77" y="249">Fender</text>
          <path d="M401 106V18" /><circle cx="401" cy="106" r="4" /><text x="383" y="13">Roof</text>
          <path d="M411 176v86" /><circle cx="411" cy="176" r="4" /><text x="375" y="280">Doors</text>
          <path d="M570 166h72v-28" /><circle cx="570" cy="166" r="4" /><text x="600" y="130">Quarter</text>
          <path d="M552 125h91V91" /><circle cx="552" cy="125" r="4" /><text x="607" y="83">Trunk</text>
        </g>
      </svg>
      <div className="vehicle-legend" aria-hidden="true">
        <span><i className="legend-panel" />Exterior panels</span>
        <span><i className="legend-structure" />Structural boundaries</span>
      </div>
    </div>
  );
}
