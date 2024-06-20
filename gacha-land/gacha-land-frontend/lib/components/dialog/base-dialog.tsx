import { Dialog, Transition } from '@headlessui/react'
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { Fragment } from 'react';


interface BaseDialogProps {
  icon?: React.ReactNode,
  color: string;
  isOpen: boolean;
  title: string;
  content: string | React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function BaseDialog({ isOpen, title, color, icon, content, onConfirm, onCancel, confirmLabel, cancelLabel }: BaseDialogProps) {
  return (
    <div className={`${isOpen ? '' : 'hidden'} relative z-10`} aria-labelledby="modal-title" role="dialog" aria-modal="true">

      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white p-10 sm:p-6 ">
              <div className="sm:flex justify-center">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-center w-[90%]">
                  <h3 className="text-xl leading-6 text-[#555555] text-center" id="modal-title">{title}</h3>
                  <div className="mt-4 mb-4 border-t border-[#eee]"></div>
                  <div className="mt-2">
                    <div className="text-sm text-gray-500">{content}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 sm:flex sm:flex-row sm:px-6 flex flex-row justify-center gap-2">
              <button onClick={onConfirm} type="button" className={`inline-flex ${!cancelLabel ? 'w-full' : '' } block py-4 justify-center rounded-full px-10 ${color === 'primary' ? 'bg-secondary' : color === 'red' ? 'bg-red-800' : 'bg-gray-800'}  text-sm font-semibold text-white shadow-sm hover:bg-${color}-500 sm:ml-3 sm:w-auto`}>{confirmLabel}</button>
              {cancelLabel && <button onClick={onCancel} type="button" className="mt-3 block px-10 justify-center rounded-full bg-white py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">{cancelLabel}</button>}
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}