import AcumuladoList from '../components/AcumuladoList.jsx'
import MasVendidos from '../components/MasVendidos.jsx'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Home</h2>
      <div className="flex gap-3 mb-4">
        <button
          className="px-4 py-2 rounded bg-blend-purple text-white"
          onClick={() => navigate('/movimientos', { state: { type: 'COMPRA' } })}
        >
          COMPRA
        </button>
        <button
          className="px-4 py-2 rounded bg-blend-purple text-white"
          onClick={() => navigate('/movimientos', { state: { type: 'VENTA' } })}
        >
          VENTA
        </button>
      </div>
      <AcumuladoList />
      <MasVendidos />
    </div>
  )
}


