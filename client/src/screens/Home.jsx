import React, { useEffect, useState } from "react";
import { CirclePlus, Loader, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "../config/axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSelector } from "react-redux";

const Home = () => {
  const user  =  useSelector(state => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

  function createProject(e) {
    e.preventDefault();
    setLoading(true);

    axios
      .post("/project/create", {
        name: projectName,
      })
      .then((res) => {
        console.log(res.data.data);
        toast.success("Project created successfully");
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to create project");
        setLoading(false);
        console.log(err);
      });
  }

  useEffect(() => {
    axios
      .get("/project/all")
      .then((res) => {
        setProjects(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <main className="p-4">
      <div className="projects flex gap-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="project flex gap-2 items-center cursor-pointer text-white bg-slate-700 p-4 hover:bg-slate-600 border border-slate-300 rounded-md"
        >
          <h1>New Project</h1>
          <CirclePlus />
        </button>
        {projects.map((project) => (
          <div
            key={project._id}
            onClick={() => navigate("/project",{
              state: {project}
            })}
            className="project flex-col flex gap-2 items-start cursor-pointer text-white bg-green-700 p-4 border hover:bg-green-600 border-slate-300 rounded-md"
          >
            <h2>Name: {project?.name}</h2>

            <div className="flex gap-2 items-center">
              <Users />
              {project?.users?.length}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="flex justify-center items-center">
          <Card className="w-[350px] bg-gray-700 text-white pb-4">
            <CardHeader>
              <CardTitle>
                <h1>Create project</h1>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={createProject}>
                <div className="grid w-full items-center gap-4 mb-6">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Project name</Label>
                    <Input
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      id="name"
                      placeholder="Name of your project"
                      className="focus:bg-gray-800 "
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    className="text-white bg-slate-800"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={loading}
                    type="submit"
                    className="text-white text-center bg-slate-800"
                  >
                    {loading ? <Loader className="animate-spin" /> : "Create"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
};

export default Home;
