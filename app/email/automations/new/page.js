"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { supabase } from "../../../lib/supabase";
import { ArrowLeft, Save, Plus, Play, GitFork, Mail, Clock, Zap } from "lucide-react";

const initialNodes = [
  {
    id: "trigger-1",
    type: "input",
    data: { label: "⚡ Trigger: User Signed Up" },
    position: { x: 250, y: 50 },
    style: { background: "#FE7733", color: "#fff", border: "none", borderRadius: "12px", padding: "12px 18px", fontWeight: "bold" }
  },
  {
    id: "action-1",
    data: { label: "✉️ Send Email: 0machine — Welcome" },
    position: { x: 250, y: 180 },
    style: { background: "#13151F", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "12px", padding: "12px 18px" }
  },
  {
    id: "delay-1",
    data: { label: "⏱️ Delay: Wait 2 Days" },
    position: { x: 250, y: 300 },
    style: { background: "#13151F", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "12px", padding: "12px 18px" }
  },
  {
    id: "action-2",
    type: "output",
    data: { label: "✉️ Send Email: 0machine — Introduction" },
    position: { x: 250, y: 420 },
    style: { background: "#10B981", color: "#fff", border: "none", borderRadius: "12px", padding: "12px 18px", fontWeight: "bold" }
  }
];

const initialEdges = [
  { id: "e1-2", source: "trigger-1", target: "action-1", animated: true },
  { id: "e2-3", source: "action-1", target: "delay-1" },
  { id: "e3-4", source: "delay-1", target: "action-2" }
];

export default function NewAutomationCanvas() {
  const router = useRouter();
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [name, setName] = useState("New 0machine Automation");
  const [triggerEvent, setTriggerEvent] = useState("user_signed_up");
  const [saving, setSaving] = useState(false);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const handleSaveWorkflow = async () => {
    setSaving(true);
    try {
      const { data: wf, error } = await supabase
        .from("workflows")
        .insert([{
          name,
          trigger_type: "event",
          trigger_event: triggerEvent,
          status: "active"
        }])
        .select()
        .single();

      if (error) throw error;

      // Save nodes & edges
      for (const node of nodes) {
        await supabase.from("workflow_nodes").insert([{
          id: `${node.id}-${wf.id}`,
          workflow_id: wf.id,
          type: node.type || "action",
          data: node.data,
          position_x: node.position.x,
          position_y: node.position.y
        }]);
      }

      for (const edge of edges) {
        await supabase.from("workflow_edges").insert([{
          id: `${edge.id}-${wf.id}`,
          workflow_id: wf.id,
          source: `${edge.source}-${wf.id}`,
          target: `${edge.target}-${wf.id}`
        }]);
      }

      alert("✅ Automation workflow saved and activated!");
      router.push("/email/automations");
    } catch (err) {
      alert(`Error saving workflow: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0A0C12] text-white">
      {/* Canvas Top Bar */}
      <div className="bg-[#13151F] border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <Link href="/email/automations" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-transparent text-lg font-bold text-white font-[Outfit] border-b border-transparent hover:border-white/20 focus:border-[#FE7733] focus:outline-none"
            />
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-gray-400 uppercase font-mono">Trigger Event:</span>
              <select
                value={triggerEvent}
                onChange={(e) => setTriggerEvent(e.target.value)}
                className="bg-[#0A0C12] border border-white/10 rounded-md px-2 py-0.5 text-xs text-[#FE7733] font-semibold"
              >
                <option value="user_signed_up">User Signed Up</option>
                <option value="email_verified">Email Verified</option>
                <option value="first_login">First Login</option>
                <option value="created_project">Created Project</option>
                <option value="used_calculator">Used Cost Calculator</option>
                <option value="created_quote">Created Quote</option>
                <option value="used_nesting">Used Nesting</option>
                <option value="viewed_pricing">Viewed Pricing</option>
                <option value="upgraded_pro">Upgraded to Pro</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveWorkflow}
          disabled={saving}
          className="bg-[#FE7733] hover:bg-[#ff8547] text-white font-semibold text-xs py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-[#FE7733]/20"
        >
          <Save size={16} />
          <span>{saving ? "Saving..." : "Save & Activate Workflow"}</span>
        </button>
      </div>

      {/* React Flow Canvas */}
      <div className="flex-1 w-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls style={{ background: "#13151F", color: "#fff", borderColor: "rgba(255,255,255,0.1)" }} />
          <Background color="#333" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
}
