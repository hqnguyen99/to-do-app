'use client';
import { useState,useRef,useEffect } from 'react';
import { nanoid } from 'nanoid';
import Image from 'next/image'
import styles from './page.module.css'
import Todo from '@/components/Todo';
import Form from '@/components/Form';
import FilterButton from '@/components/FilterButton';

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};
const FILTER_NAMES = Object.keys(FILTER_MAP);
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default function Home() {
  const [tasks, setTasks] = useState(TASKS);
  const [filter,setFilter]= useState("All");
  const listHeadingRef= useRef(null);
  function toggleTaskCompleted(id) {
    const updateTasks= tasks.map((task)=>{
      if(task.id == id) {
        return {...task, completed: !task.completed}
      };
      return task;
    })
    setTasks(updateTasks);
  }

  function deleteTask(id){
    const updateTasks = tasks.filter((task)=>{
      return task.id !=id;
    })
    setTasks(updateTasks);
  }
  function editTask(id,newName){
    const updateTasks= tasks.map((task)=>{
      console.log(id);
      if( id == task.id){
        return {...task,name: newName};
      }
      return task;
    })
    setTasks(updateTasks);
  }
  const taskList = tasks
  .filter(FILTER_MAP[filter])
  .map((task) => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));
  function addTask(name) {
    const newTask = { id: `todo-${nanoid()}`, name, completed: false };
    setTasks([...tasks, newTask]);
  }
  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  
  const filterList= FILTER_NAMES.map((name)=> (
    <FilterButton 
    key={name} 
    name= {name}
    isPressed = {name == filter}
    handleFilter= {setFilter}/>
  ))
  const prevTaskLength = usePrevious(tasks.length);
  useEffect(()=>{
    if(prevTaskLength == tasks.length+1){
      listHeadingRef.current.focus();
    }
  },[prevTaskLength,tasks.length])
  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>

      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}

      </div>
      <h2 id="list-heading" tabIndex="-1" ref= {listHeadingRef}>{headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}
const TASKS = [
  { id: "todo-0", name: "Eat", completed: true },
  { id: "todo-1", name: "Sleep", completed: false },
  { id: "todo-2", name: "Study", completed: false },
]
