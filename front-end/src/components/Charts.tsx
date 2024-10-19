
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts'
import { useState } from 'react'
import Modal from 'react-modal'

import { type TransformedData, type LineData } from '../hooks/useAnalyticsData'

Modal.setAppElement('#root') 

type Props = {
  data: TransformedData[]
  lineData: LineData
}

const Charts = ({ data, lineData }: Props) => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const handleBarClick = (data: any) => {
    if (data && data.activeLabel) {
      const feature = data.activeLabel.toLowerCase()
      setSelectedFeature(feature)
      setModalIsOpen(true)
    }
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  return (
    <section className="py-16">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} onClick={handleBarClick}>
          <XAxis dataKey="feature" />
          <YAxis />
          <Legend />
          <Bar dataKey="totalTime" fill="#8884d8">
            <LabelList dataKey="totalTime" position="center" fill="#000" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>


      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Line Chart"
        className="flex items-center justify-center fixed inset-0 z-50 px-2"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
      >
        <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">

          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <span className="text-2xl">&times;</span>
          </button>
          <h2 className="text-xl font-semibold mb-4">
            {selectedFeature ? `Line Chart for ${selectedFeature}` : 'Line Chart'}
          </h2>
          {selectedFeature && lineData[selectedFeature] && lineData[selectedFeature].length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={lineData[selectedFeature]}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center">No data available for this feature.</p>
          )}
        </div>
      </Modal>
    </section>
  )
}

export default Charts
