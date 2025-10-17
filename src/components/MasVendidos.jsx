import React, { useEffect, useState } from 'react'
import { fetchTopSoldWines } from '../lib/api'

export default function MasVendidos() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadData() {
      try {
        const result = await fetchTopSoldWines({ signal: controller.signal })
        setData(result)
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
    return () => controller.abort()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-center text-red-500 font-medium">
        Error: {error}
      </p>
    )
  }

  if (!data.length) {
    return (
      <p className="text-center text-gray-500">
        No se encontraron ventas este mes.
      </p>
    )
  }

  return (
    <div className="">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
        🏆 Vinos Más Vendidos del Mes
      </h2>
      <div className="flex flex-col">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-2 capitalize">
              {item.vino_nombre}
            </h3>
            <p className="text-sm text-gray-600">
              Total botellas: <span className="font-medium">{item.botellas_vendidas}</span>
            </p>
            <p className="text-sm text-gray-600">
              Veces vendido: <span className="font-medium">{item.cantidad_ventas}</span>
            </p>
            <p className="text-sm text-green-600 font-semibold mt-2">
              Total dinero: ${Number(item.total_dinero).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
