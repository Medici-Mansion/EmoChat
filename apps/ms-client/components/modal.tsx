'use client'

import Image from 'next/image'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface ModalProps {
  isOpen: boolean
  modalHandler: () => void
}

interface Faces {
  title: string
  src: string
  info: string
}

const Modal = ({ isOpen, modalHandler }: ModalProps) => {
  const faces: Faces[] = [
    { title: '행복', src: '/images/face/face1.png', info: '입꼬리 미소' },
    { title: '슬픔', src: '/images/face/face2.png', info: '입꼬리 아래로' },
    { title: '놀람', src: '/images/face/face3.png', info: '입 벌림' },
    { title: '혐오', src: '/images/face/face4.png', info: '코 찡그림' },
    {
      title: '분노',
      src: '/images/face/face5.png',
      info: '코 찡그리고 입 벌림',
    },
    { title: '공포', src: '/images/face/face6.png', info: '입 네모나게' },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={modalHandler}>
      <DialogContent className="dark:bg-[#10171C]">
        <DialogTitle className="text-[#0C8AFF] text-[16px] px-2">
          표정 가이드
        </DialogTitle>
        <DialogDescription className="py-1 px-2 text-[14px]">
          카메라를 통해 6가지 감정을 모델이 인식합니다.
          <br />
          무표정(중립)은 기존 메신저와 같이 기본 폰트로 구성됩니다.
          <br />
          6가지 감정이 인식되면 다양한 서체가 적용되니 자유롭게 활용해보세요!
        </DialogDescription>
        <div className="w-full grid grid-cols-3 gap-y-8 gap-x-5 py-2">
          {faces.map((item) => (
            <div
              key={item.title}
              className="flex flex-col justify-center items-center space-y-4 dark:text-black"
            >
              <div className="bg-[#EFF0F2] px-3 py-1 rounded-2xl">
                {item.title}
              </div>
              <Image
                src={item.src}
                width={'160'}
                height={'200'}
                alt="faceImage"
              />
              <div className="dark:text-white">{item.info}</div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Modal
