import React, {Component} from 'react'
import '../App.css'
import axios from 'axios'
import Modal from "react-modal";
Modal.setAppElement("#root");
class ToDoForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            toDo : [],
            task : '',
            editIndex:null,
            openAdd : false,
            remark:''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleEditChange = this.handleEditChange.bind(this);
        this.handleDialogOpen = this.handleDialogOpen.bind(this);
        this.handleCancle = this.handleCancle.bind(this)
    }
    async componentDidMount() {
        try {
            const getData = await axios.get('http://localhost:5000/api/todos');
            this.setState({toDo:getData.data})
        }
        catch(e){
            console.log(e)
        }
    }
    handleChange(event) {
        const { name, value } = event.target;
        console.log(name,value)
        this.setState({ [name]: value });
      }
    handleEditChange(event){
        this.setState({handleEdit:event.target.value})
    }
    handleAdd = async (event) => {
        event.preventDefault();
        if(this.state.editIndex !== null){
            const findId = this.state.toDo[this.state.editIndex]
            const body = {
                id : findId.id,
                task:this.state.task,
                priority:this.state.priority,
                remark:this.state.remark
            }
            try{

                const result = await axios.post(`http://localhost:5000/api/edittodo`,body)
                const editTodo = [...this.state.toDo]
                editTodo[this.state.editIndex] = result.data.updatedTask
                this.setState({
                    toDo: editTodo,
                    task: "",
                    priority: "Low",
                    completed: false,
                    editIndex: null,
                  });
                  alert("Task updated successfully!");
                  this.handleCancle();
            }
            catch (error) {
                console.error("Error updating task:", error);
                alert("Failed to update the task. Please try again.");
              }
        }
        else {
            if(this.state.task.trim() !== ''){
                const newTask = {
                    task : this.state.task,
                    remark:this.state.remark ?? null,
                    priority: this.state.priority ?? 'Low'
                }
                try {
                   
                    const response = await axios.post('http://localhost:5000/api/todos',newTask);
                    this.setState((prevState)=>({
                        toDo:[...prevState.toDo,response.data],
                        task:'',
                        priority:'',
                        remark:''
                    }))
                    // this.handleDialogOpen();
                    this.handleCancle();
                }
                catch(e){
                    console.error(e)
                }
            }
        }
    }

    handleDelete = async(index,id) => {
        try {
            await axios.delete(`http://localhost:5000/api/todos/${id}`);
            console.log('Enter..here?')
                this.setState((prevState)=>{
                    const updatedToDo = prevState.toDo.filter((val,ind)=>ind!==index)
                    return {toDo:updatedToDo}
                })
                alert('Task deleted successfully')
        }
        catch(e){
            console.error(e)
        }
    }
    handleEdit = (index,id) => {
        console.log('this.state.editTask')
        this.handleDialogOpen();
        this.setState({
            task:this.state.toDo[index].task,
            priority:this.state.toDo[index].priority,
            remark:this.state.toDo[index].remark,
            editIndex:index
        })
    }

    handleDialogOpen = () => {
        this.setState({
            openAdd:true
        })
    }
    handleCancle = () => {
        this.setState({
            openAdd:false,
            task:'',
            remark:'',
            priority:'',
        })
    }
    

 render(){
     const {task,toDo} = this.state
    return (
        <div>
            <div className="mainButtonContainer">
            <button onClick={this.handleDialogOpen} className="mainButton">Task Form</button>
            </div>
            {this.state.openAdd && (
                <div className="mainFormDiv1">
                    <div className="mainFormDiv">
                <form onSubmit={this.handleAdd}>
                    <div className="taskInput">
                       <input type="text" name="task" value={task} onChange={this.handleChange} style={styles.input} placeholder="Add task"/>
                    </div>
                    <div className="taskInput">
                        <select  value={this.state.priority} onChange={this.handleChange} style={styles.input } name="priority">
                            <option value="" disabled selected hidden style={{color:'grey'}}>priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div className="taskInput">
                        <input type="text" value={this.state.remark} onChange={this.handleChange} placeholder="remark" style={styles.input
                        } name="remark"/>
                    </div>
                    <div className="buttonDiv">
                   <button style={styles.button} onClick={this.handleCancle}>Cancle</button>
                   <button style={styles.button} type="submit">Add Task</button>
                    </div>
                </form>
                </div>
                </div>
            )}
            {/* <div style={styles.main}>
            {this.state.editIndex !== null ? (
                <button style={styles.button} onClick={this.handleAdd}>Save</button>
            ):(
            )}
            </div>  */}
            <div className="tableContainer">
                <table className="tablestyle">
                    <thead>
                    <tr>
                        <th>Task</th>
                        <th>Priority</th>
                        <th>Remark</th>
                        <th>Completed</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.toDo.length > 0 ? (
                        this.state.toDo.map((todo,index)=>(
                            <tr key = {todo.id}>
                                <td>{todo.task}</td>
                                <td>{todo.priority}</td>
                                <td>{todo.remark? todo.remark : '-'}</td>
                                <td>{todo.completed?1:0}</td>
                                <td>
                                <button style={styles.del} onClick={()=>this.handleDelete(index,todo.id)}>Delete</button>
                                <button style={styles.edit} onClick={()=> this.handleEdit(index,todo.id)}>Edit</button> 
                                </td>
                            {/* <li key={index} style={styles.item}>
                                {todo.task}
                            </li>
                            */}
                            </tr>
                        ))
                    ):(
                        <tr>
                        <td >No tasks added yet</td>
                      </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
 }
}

const styles = {
    main:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    },
    input : {
        padding:'10px',
        // alignItems:'center',
        margin:'10px',
        // display:'block',
        borderRadius:'5px',
        width:'100%'
    },
    select:{
        padding:'10px',
        width:'100%'
    },
    button:{
        padding:'10px',
        margin:'8px',
        border:'none',
        borderRadius:'5px',
        backgroundColor:'lightBlue',
        fontWeight:'bold'
    },
    list : {
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
    },
    item:{
        padding:'3px',
        color : 'green',
        fontSize:'20px',
        margin:'3px',
        fontSize:'20px'
    },
    del :{
        padding:'8px',
        backgroundColor:'red',
        color:'white',
        margin:'3px',
        border:'none',
        borderRadius:'3px',
        
    },
    edit :{
        backgroundColor:'green',
        margin:'3px',
        padding:'8px',
        border:'none',
        borderRadius:'3px',
        color:'white'
    }
}

export default ToDoForm;