import AcumuladoList from '../components/AcumuladoList.jsx'
import MasVendidos from '../components/MasVendidos.jsx'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="py-2 px-4">
      <div className='flex flex-col md:flex-row gap-4'>
        <div className="w-full md:w-1/2">
          <AcumuladoList />
        </div>
        <div className="w-full md:w-1/2">
          <MasVendidos />
        </div>
      </div>
      <div className="flex gap-3 m-4 max-w-md mx-auto">
        <button
          className="flex-1 px-4 py-2 rounded bg-blend-purple text-white hover:bg-blend-purple-dark hover:cursor-pointer"
          onClick={() => navigate('/movimientos', { state: { type: 'COMPRA' } })}
        >
          COMPRA
        </button>
        <button
          className="flex-1 px-4 py-2 rounded bg-blend-purple text-white hover:bg-blend-purple-dark hover:cursor-pointer"
          onClick={() => navigate('/movimientos', { state: { type: 'VENTA' } })}
        >
          VENTA
        </button>
      </div>
    </div>
  )
}


