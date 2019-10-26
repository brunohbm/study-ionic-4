import { 
  add,
  more,
  trash,
  camera,
  doneAll,
  microphone,
  closeCircle,
} from "ionicons/icons";
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,  
  IonList,
  IonItem,
  IonLabel,  
  IonFab,
  IonIcon,
  IonFabButton,   
  IonFabList, 
  IonModal,
  IonButton,
  IonSlides,
  IonInput,
  IonTextarea,
  IonActionSheet,
  IonSlide,
  IonLoading,  
  IonToast,
} from '@ionic/react';
import React from 'react';

import FirebaseService from '../services/FirebaseService';

class About extends React.Component {

  state = {
    showList: false,
    showModal: false,
    showLoading: false,
    showToast: false,
    showModalCamera: false,
    showModalAudio: false,
    todoAteracao: {},
    todos: [],
    dones: [],
  }

  componentDidMount() {
    FirebaseService.getDataList('todos', (dataReceived) => {            
      this.setState({todos: dataReceived});
    })
    FirebaseService.getDataList('done', (dataReceived) => {                  
      this.setState({dones: dataReceived});
    })
}

  deletaTodo = () => {
    this.setState({ showLoading: true, showList: false } , () => {
      const { todoAteracao } = this.state;

      setTimeout(() => {
        FirebaseService.remove(todoAteracao.key ,'todos');        
        this.setState({ showLoading: false, todoAteracao: {} }, () => {
          this.setState({ showToast: true });
        });
      }, 2000);
    });    
  }

  passarParaDone = () => {
    this.setState({ showLoading: true, showList: false } , () => {
      const { todoAteracao, todos, dones } = this.state;      

      setTimeout(() => {
        FirebaseService.remove(todoAteracao.key ,'todos');   
        const doneTask = todos.filter(todo => { return todo.key === todoAteracao.key });
        
        this.setState({ showLoading: false, todoAteracao: {}, dones }, () => {
          this.setState({ showToast: true });
        });

        FirebaseService.pushData('done', ...doneTask);
      }, 2000);
    });    
  }

  getActions = () => {
    const { showList } = this.state;

    return (
      <IonActionSheet
        isOpen={showList}
        onDidDismiss={this.fechaList}
        buttons={[{
          text: 'Delete',
          role: 'destructive',
          icon: trash,
          handler: this.deletaTodo,
        }, {
          text: 'Done',
          icon: doneAll,
          handler: this.passarParaDone,
        }, {
          text: 'Cancel',
          role: 'cancel',
        }]}
      />
    );
  }

  getList = (todo, done) => (
    <IonItem key={todo.key}>
        <IonLabel>
          <h2>
            <b>
              {todo.nome}
            </b>
          </h2>
          <h3>
            {todo.descricao}
          </h3>
        </IonLabel>
        {this.getActions()}
        {done ? null: (
           <IonButton slot="end"  onClick={() => { this.abreList(todo); }}>
            <IonIcon icon={more} />
          </IonButton>
        )}        
    </IonItem>  
  )

  getListToDo = () => {
    const { todos } = this.state;    
    return todos.map(todo => this.getList(todo, false))
  }

  getListDone = () => {
    const { dones } = this.state;    
    return dones.map(done => this.getList(done, true))
  }

  fechaList = () => {
    this.setState({ showList: false });
  }

  abreList = todo => {
    this.setState({ showList: true, todoAteracao: todo });
  }

  fechaModal = () => {
    this.setState({ showModal: false });
  }

  abreModal = () => {
    this.setState({ showModal: true });
  }

  abrirModalCamera = () => {
    this.setState({ showModalCamera: true });
  }

  fechaModalAudio = () => {
    try {
      const player = document.getElementById('player');
      player.srcObject.getVideoTracks().forEach(track => track.stop());
    } catch (error) {
      console.warn(error);
    } finally {
      this.setState({ showModalAudio: false });
    }
  }

  abrirModalAudio = () => {
    console.warn(navigator.onLine);
    this.setState({ showModalAudio: true });
  }

  fechaModalCamera = () => {
    try {
      const player = document.getElementById('player');
      player.srcObject.getVideoTracks().forEach(track => track.stop());
    } catch (error) {
      console.warn(error);
    } finally {
      this.setState({ showModalCamera: false });
    }
  }

  salvarTodo = e => {
    e.preventDefault();
    this.setState({ showModal: false, showLoading: true }, () => {
      setTimeout(() => {
        const { nome, descricao } = this.state;        
        FirebaseService.pushData('todos', { nome, descricao });
        this.setState({ showLoading: false }, () => {
          this.setState({ showToast: true });
        });
      }, 1500);
    });    
  }

  setInputValue = e => {    
    this.setState({ [e.target.name]: e.target.value });
  }

  startAudio = () => {    
    const player = document.getElementById('player');

    const handleSuccess = function(stream) {
      if (window.URL) {
        player.srcObject = stream;
      } else {
        player.src = stream;
      }
    };
  
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(handleSuccess);
  }

  startCamera = () => {
    const player = document.getElementById('player');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    const constraints = { video: true };

    // Attach the video stream to the video element and autoplay.
    navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      player.srcObject = stream;
    });

    navigator.vibrate(2000);

    context.drawImage(player, 0, 0, canvas.width, canvas.height);     
  }

  getModalCamera = () => {
    const { showModalCamera } = this.state;

    return (
      <IonModal isOpen={showModalCamera}>
        <video id="player" controls autoPlay></video>        
        <canvas id="canvas" style={{ height: '100%', width: '100%' }} />
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={this.fechaModalCamera}>
            <IonIcon icon={closeCircle} />
          </IonFabButton>
        </IonFab>
        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton onClick={this.startCamera}>
            <IonIcon icon={camera} />
          </IonFabButton>
        </IonFab>
      </IonModal>
    )
  }

  getModalAudio = () => {
    const { showModalAudio } = this.state;

    return (
      <IonModal isOpen={showModalAudio}>
        <div style={{ marginTop: '50px', width: '100%', textAlign: 'center' }}>
          <input type="file" accept="audio/*" capture id="recorder" />
          <audio id="player" controls></audio>
        </div>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={this.fechaModalAudio}>
            <IonIcon icon={closeCircle} />
          </IonFabButton>
        </IonFab>
        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton onClick={this.startAudio}>
            <IonIcon icon={microphone} />
          </IonFabButton>
        </IonFab>
      </IonModal>
    )
  }

  getModal = () => {
    const { showModal } = this.state;

    return (
      <IonModal isOpen={showModal}>
        <form onSubmit={this.salvarTodo}>
          <IonItem>
            <IonLabel position="fixed">Nome</IonLabel>
            <IonInput clearInput name="nome" onBlur={this.setInputValue} placeholder="Nome da tarefa"/>
          </IonItem>
          <IonItem>
            <IonLabel position="fixed">Descrição</IonLabel>
            <IonTextarea clearInput name="descricao" placeholder="Descrição da tarefa" onBlur={this.setInputValue}/>
          </IonItem>
          <div
            style={{
              position: 'fixed',
              bottom: '0',
              width: '100%',
            }}
          >
            <div style={{ width: '50%', display: 'inline-block', float: 'right' }}>
              <IonButton type="submit" expand="block" mode="ios">Save</IonButton>
            </div>
            <div style={{ width: '50%', display: 'inline-block' }}>
              <IonButton onClick={this.fechaModal} expand="block" mode="ios" color="light">Cancel</IonButton>
            </div>
          </div>
        </form>        
      </IonModal>
    )
  }

  getLoad = () => {
    const { showLoading } = this.state;

    return (
      <IonLoading
        isOpen={showLoading}        
        message={'Loading...'}        
      />
    );
  }

  getToast = () => {
    const { showToast } = this.state;

    return (
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => { this.setState({ showToast: false }) }}
        message="Alteração realizada com sucesso."
        duration={1000}
      />
    );
  }

  getToDoList = () => {

    return (
      <>
              <IonHeader>
          <IonToolbar>
            <IonTitle>To Do</IonTitle>
          </IonToolbar>
        </IonHeader>
      <IonList>
        {this.getListToDo()}                     
      </IonList> 
      <IonFab vertical="bottom" horizontal="start" slot="fixed">
        <IonFabButton>
          <IonIcon icon={more} />
        </IonFabButton>
        <IonFabList side="top" onClick={this.abrirModalCamera}>
          <IonFabButton><IonIcon icon={camera}/></IonFabButton>
        </IonFabList>
        <IonFabList side="end" onClick={this.abrirModalAudio}>
          <IonFabButton><IonIcon icon={microphone}/></IonFabButton>
        </IonFabList>
      </IonFab>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={this.abreModal}>
              <IonIcon  icon={add} />
          </IonFabButton>         
      </IonFab>
      </>
    );
  }

  getDoneList = () => {

    return (
      <>
              <IonHeader>
          <IonToolbar>
            <IonTitle>Done</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {this.getListDone()}                     
        </IonList>              
      </>
    );
  }

  getSlides = () => {
    const slideOpts = {
      initialSlide: 1,
      speed: 400
    };

    return (
      <>
      <IonSlides mode="ios" options={slideOpts}>
        <IonSlide>   
          <div style={{ width: '100vw', height: '100vh' }}>
            {this.getToDoList()}
          </div>
        </IonSlide>
        <IonSlide>
        <div style={{ width: '100vw', height: '100vh' }}>
            {this.getDoneList()}
          </div>
        </IonSlide>
      </IonSlides>
    </>
    );
  }

  render() {    

    return (
    <IonPage>
        <IonContent>
            {this.getLoad()}
            {this.getToast()}
            {this.getModal()}
            {this.getSlides()}
            {this.getModalAudio()}
            {this.getModalCamera()}
        </IonContent>
      </IonPage>
    );
  }

}

export default About;
