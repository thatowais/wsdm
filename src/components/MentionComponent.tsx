import { NodeViewWrapper } from '@tiptap/react';
import { FileText } from 'lucide-react';

export default function MentionComponent(props: any) {
    return (
        <NodeViewWrapper className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-xs font-medium align-middle mx-0.5 border border-emerald-100/50 select-none">
            <FileText size={10} className="stroke-[2.5]" />
            <span>{props.node.attrs.label}</span>
            {/* Hide the slash that might be part of the label if we didn't filtering it out, but we will filter it out in the suggestion configuration */}
        </NodeViewWrapper>
    );
}
