const M_QUERY = `// Conecta al API de Awki y normaliza las lecturas (ETL)
let
    Origen = Json.Document(
        Web.Contents(
            "https://api.awki.cl/api/v1/lecturas",
            [Headers = [#"Authorization" = "Bearer " & Token]]
        )
    ),
    datos = Origen[data],
    #"Convertido a tabla" = Table.FromList(
        datos, Splitter.SplitByNothing(), null, null, ExtraValues.Error
    ),
    #"Columnas expandidas" = Table.ExpandRecordColumn(
        #"Convertido a tabla", "Column1",
        {"placa", "ts", "sf", "rssi", "bateria_mv", "nodo", "lat", "lon"},
        {"placa", "ts", "sf", "rssi", "bateria_mv", "nodo", "lat", "lon"}
    ),
    #"Tipo cambiado" = Table.TransformColumnTypes(
        #"Columnas expandidas",
        {{"ts", type datetime}, {"bateria_mv", Int64.Type}, {"rssi", Int64.Type}}
    )
in
    #"Tipo cambiado"`;

const DAX = `// Siniestralidad: eventos por tramo de ruta (Macrozona Norte)
Siniestralidad =
DIVIDE(
    COUNTROWS( 'Lecturas' ),
    DISTINCTCOUNT( 'Lecturas'[tramo_ruta] ),
    0
)

// Reincidencia: patentes con 3+ detecciones en 30 dias
Reincidencia_30d =
CALCULATE(
    COUNTROWS( 'Lecturas' ),
    FILTER(
        VALUES( 'Lecturas'[placa_cifrada] ),
        CALCULATE(
            COUNTROWS( 'Lecturas' ),
            DATESINPERIOD(
                Calendario[Fecha],
                MAX( Calendario[Fecha] ),
                -30, DAY
            )
        ) >= 3
    )
)`;

function CodeBlock({
  lang,
  filename,
  code,
  color,
}: {
  lang: string;
  filename: string;
  code: string;
  color: string;
}) {
  return (
    <div className="panel clip-corner overflow-hidden">
      <div className="flex items-center justify-between border-b border-surface-border bg-surface-deep px-4 py-2 font-mono text-[10px]">
        <span className={`${color}`}>{lang}</span>
        <span className="text-ink-faint">{filename}</span>
      </div>
      <pre className="overflow-x-auto bg-void p-4 font-mono text-xs leading-relaxed text-ink-dim">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/**
 * Integración Analítica — queries Power Query M (ETL) y fórmulas DAX
 * para métricas de siniestralidad y reincidencias en Power BI.
 */
export default function PowerBi() {
  return (
    <section className="relative border-t border-surface-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:py-24">
        <p className="section-kicker">[ FASE 4 · INTEGRACIÓN ANALÍTICA ]</p>
        <h3 className="mt-3 font-sans text-2xl font-bold tracking-tight text-ink sm:text-4xl">
          Datos listos para <span className="text-neon-amber">Power BI</span>.
        </h3>
        <p className="mt-5 max-w-2xl font-mono text-sm leading-relaxed text-ink-dim">
          Los clientes logísticos conectan el API de Awki y calculan métricas de{" "}
          <span className="text-ink">siniestralidad</span> y{" "}
          <span className="text-ink">reincidencias</span> con{" "}
          <span className="text-ink">Power Query M</span> (ETL) y fórmulas{" "}
          <span className="text-ink">DAX</span>.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <CodeBlock
            lang="Power Query M"
            filename="awki-etl.m"
            code={M_QUERY}
            color="text-neon-cyan"
          />
          <CodeBlock
            lang="DAX"
            filename="metricas.pbix"
            code={DAX}
            color="text-neon-amber"
          />
        </div>
      </div>
    </section>
  );
}
