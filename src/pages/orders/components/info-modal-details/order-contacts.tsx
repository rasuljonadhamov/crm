interface OrderContactsProps {
    formData: any
  }
  
  export function OrderContacts({ formData }: OrderContactsProps) {
    return (
      <>
        <div className="bg-cyan-500 flex py-2 px-6 text-white justify-center">
          <p className="text-[20px] font-bold">Контакты сторон</p>
        </div>
  
        <div className="flex gap-10 px-3 border-b-2 border-[#03B4E0] mx-7 pb-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <p className="font-bold min-w-[120px]">Заказчик</p>
              <input
                type="text"
                value={formData.customer.organizationName}
                className="border w-full ml-3 border-gray-300 rounded px-2 py-1 text-sm"
                readOnly
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="font-bold min-w-[120px]">ИНН</p>
              <input
                type="text"
                value={formData.customer.inn}
                className="border w-full ml-3 border-gray-300 rounded px-2 py-1 text-sm"
                readOnly
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="font-bold min-w-[120px]">Раб телефон</p>
              <input
                type="text"
                value={formData.customer.organizationPhone}
                className="border w-full ml-3 border-gray-300 rounded px-2 py-1 text-sm"
                readOnly
              />
            </div>
          </div>
  
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <p className="font-bold min-w-[120px]">Отвественный</p>
              <input
                type="text"
                value={formData.customer.fio}
                className="border w-full ml-3 border-gray-300 rounded px-2 py-1 text-sm"
                readOnly
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="font-bold min-w-[120px]">Телефон</p>
              <input
                type="text"
                value={formData.customer.phone}
                className="border w-full ml-3 border-gray-300 rounded px-2 py-1 text-sm"
                readOnly
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="font-bold min-w-[120px]">Почта</p>
              <a
                href={`mailto:${formData.customer.email}`}
                className="border ml-3 w-full border-gray-300 rounded px-2 py-1 text-sm flex justify-center text-primary underline"
              >
                {formData.carrier.email}
              </a>
            </div>
          </div>
        </div>
  
        <div className="flex gap-10 px-3 border-b-2 border-[#03B4E0] mx-7 pb-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <p className="font-bold min-w-[120px]">Перевозчик</p>
              <input
                type="text"
                value={formData.carrier.organizationName}
                className="border w-full ml-3 border-gray-300 rounded px-2 py-1 text-sm"
                readOnly
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="font-bold min-w-[120px]">ИНН</p>
              <input
                type="text"
                value={formData.carrier.inn}
                className="border w-full ml-3 border-gray-300 rounded px-2 py-1 text-sm"
                readOnly
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="font-bold min-w-[120px]">Раб телефон</p>
              <input
                type="text"
                value={formData.carrier.organizationPhone}
                className="border w-full ml-3 border-gray-300 rounded px-2 py-1 text-sm"
                readOnly
              />
            </div>
          </div>
  
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <p className="font-bold min-w-[120px]">Отвественный</p>
              <input
                type="text"
                value={formData.carrier.fio}
                className="border w-full ml-3 border-gray-300 rounded px-2 py-1 text-sm"
                readOnly
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="font-bold min-w-[120px]">Телефон</p>
              <input
                type="text"
                value={formData.carrier.phone}
                className="border w-full ml-3 border-gray-300 rounded px-2 py-1 text-sm flex justify-center items-center"
                readOnly
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="font-bold min-w-[120px]">Почта</p>
              <a
                href={`mailto:${formData.carrier.email}`}
                className="border w-full ml-3 border-gray-300 rounded px-2 py-1 text-sm flex justify-center text-primary underline"
              >
                {formData.carrier.email}
              </a>
            </div>
          </div>
        </div>
  
        <div className="bg-cyan-500 flex py-2 px-6 text-white justify-center">
          <p className="text-[20px] font-bold">Приклепленные файлы</p>
        </div>
  
        <div className="flex flex-col text-[#03B4E0] font-bold underline px-10">
          {formData.assignedVehicleFiles.map((file, index) => (
            <a key={index} href={file.link}>
              Ссылка
            </a>
          ))}
        </div>
  
        <div className="bg-cyan-500 flex py-2 px-6 text-white justify-center">
          <p className="text-[20px] font-bold">Сформированные документы</p>
        </div>
  
        {formData.documentOrderItems.map((doc, index) => (
          <div key={index} className="flex px-10">
            <p className="text-[16px] font-bold">{doc.DisplayName}</p>
            <div className="ml-3 flex text-[#03B4E0] font-bold underline gap-2">
              <a className="" href={doc.uriHtml}>
                HTML
              </a>
              <a href={doc.uriPdf}>PDF</a>
              <a href={doc.uriPdfDownload}>Скачать</a>
            </div>
          </div>
        ))}
      </>
    )
  }
  
  