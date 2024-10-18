interface PrescriptionModalProps {
    prescription: Prescription[];
    onClose: () => void;
}

interface Prescription {
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({ prescription, onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg w-1/2 p-8">
          <h2 className="text-2xl font-semibold mb-4 underline">Prescription Details</h2>
          {prescription && (
            <div className="flex flex-col space-y-4">
              {prescription.map((item: Prescription, index:number) => (
                <div key={index} className="flex flex-col border-b-2 py-4">
                  <div className="flex flex-row gap-8 justify-between w-full">
                    <p className="text-lg">
                      <span className="font-semibold">Medicine:</span> {item.medicine}
                    </p>
                    <p className="text-lg">
                      <span className="font-semibold">Dosage:</span> {item.dosage}
                    </p>
                  </div>
                  <div className="flex flex-row gap-8 justify-between w-full">
                  <p className="text-lg">
                    <span className="font-semibold">Frequency:</span> {item.frequency}
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">Duration:</span> {item.duration}
                  </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:scale-105 transition-transform"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };