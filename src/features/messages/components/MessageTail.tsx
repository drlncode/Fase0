import { TrinagleRectangleLeftIcon, TrinagleRectangleRightIcon } from '@/shared/components/ui/Icons';

export function MessageTail({ side }: { side: 'received' | 'sent' }) {
    return side === 'received'
        ? <TrinagleRectangleRightIcon size={10} />
        : <TrinagleRectangleLeftIcon size={10} />
}
