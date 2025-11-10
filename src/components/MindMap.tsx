import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';

interface MindMapNode {
  id: string;
  label: string;
  details: string;
  children: string[];
  // Optional richer fields if the AI provides them
  examples?: string[];
  resources?: { title: string; url?: string; type?: string }[];
}

interface MindMapData {
  topic: string;
  nodes: MindMapNode[];
}

interface MindMapProps {
  data: MindMapData;
  onClose: () => void;
}

const MindMap = ({ data, onClose }: MindMapProps) => {
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1']));

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getNodeById = (id: string): MindMapNode | undefined => {
    return data.nodes.find(node => node.id === id);
  };

  const renderNode = (nodeId: string, level: number = 0) => {
    const node = getNodeById(nodeId);
    if (!node) return null;

    const hasChildren = node.children.length > 0;
    const isExpanded = expandedNodes.has(nodeId);

    return (
      <div key={node.id} className="ml-4">
        <div
          className={`flex items-center gap-2 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer my-2 ${
            selectedNode?.id === node.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => setSelectedNode(node)}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(nodeId);
              }}
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              />
            </Button>
          )}
          <span className="font-medium">{node.label}</span>
        </div>
        {isExpanded && hasChildren && (
          <div className="ml-4 border-l-2 border-border pl-2">
            {node.children.map(childId => renderNode(childId, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootNode = data.nodes.find(node => node.id === '1');

  return (
    <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">{data.topic}</CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden flex gap-4">
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {rootNode && renderNode(rootNode.id)}
            </div>
          </div>
          {selectedNode && (
            <div className="w-96 border-l pl-4 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-2">{selectedNode.label}</h3>
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{selectedNode.details}</ReactMarkdown>
              </div>

              {/* Connections */}
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Connections</h4>
                <ul className="space-y-1">
                  {selectedNode.children.map((childId) => {
                    const child = getNodeById(childId);
                    if (!child) return null;
                    return (
                      <li key={childId}>
                        <button
                          className="text-primary hover:underline text-sm"
                          onClick={() => setSelectedNode(child)}
                        >
                          {child.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Resources */}
              {selectedNode.resources && selectedNode.resources.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">Resources</h4>
                  <ul className="space-y-1">
                    {selectedNode.resources.map((r, idx) => (
                      <li key={idx}>
                        {r.url ? (
                          <a href={r.url} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm">
                            {r.title}
                          </a>
                        ) : (
                          <span className="text-sm">{r.title}</span>
                        )}
                        {r.type && <span className="ml-2 text-xs text-muted-foreground">({r.type})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Examples */}
              {selectedNode.examples && selectedNode.examples.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">Examples</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {selectedNode.examples.map((ex, i) => (
                      <li key={i} className="text-sm">
                        <ReactMarkdown>{ex}</ReactMarkdown>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Helpful links */}
              <div className="mt-4">
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedNode.label)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  Search videos for "{selectedNode.label}"
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={false}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Node Details</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MindMap;
