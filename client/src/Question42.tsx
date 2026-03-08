export default function Question42() {
  const question = "Qual é a representação binária de 42?"

  const choices = [
    "101010",
    "100101",
    "110010",
    "111000"
  ]

  return (
    <div>
      <h2>{question}</h2>
      {choices.map(c => (
        <button key={c}>{c}</button>
      ))}
    </div>
  )
}