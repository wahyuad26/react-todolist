
import React, {Component} from 'react';
import { Hoshi } from 'react-native-textinput-effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  View,
  Text,
  StatusBar,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';

let dataTodo = [];

class App extends Component {
  //variabel/state
  constructor(props){
    super(props);
    this.state = {
      newTodo:'',
      openModal: false,
      indexTodo: -1,
      textTodo: '',
      editMode: false,
    };
  }

  //ambil data dari storage di awal
  componentDidMount(){
    this.getData();
  }

  //fungsi simpan data ke storage
  storeData = async () => {
    try {
      await AsyncStorage.setItem('@todoData', JSON.stringify(dataTodo));
    } catch (e) {
      // saving error
      console.warn('eror saving');
    }
  }

  //fungsi ambil data dari storage
  getData = async () => {
    try {
      let value = await AsyncStorage.getItem('@todoData');
      const jsonValue = JSON.parse(value);
      if(jsonValue !== null) {
        dataTodo = jsonValue;
        this.setState({});
      }
    } catch(e) {
      // error reading value
      console.warn('eror get data');
    }
  }

  //fungsi menambah data
  addNewTodo = () => {
    dataTodo.push({
      todo: this.state.newTodo, check: false
    });
    this.setState({newTodo: ''});
    this.storeData();
  }

  //fungsi edit data
  edit = () => {
    this.setState({newTodo: this.state.textTodo, openModal: false, editMode: true});
  }

  //fungsi simpan edit data
  onSubmitEdit = () => {
    dataTodo[this.state.indexTodo].todo = this.state.newTodo;
    this.storeData();
    this.setState({editMode: false, newTodo: ''});
  }

  //fungsi hapus data
  delete = (index) => {
    dataTodo.splice(index, 1);
    this.setState({openModal: false});
    this.storeData();
  }

  //fungsi centang data
  check = (index) => {
    dataTodo[index].check = !dataTodo[index].check;
    this.setState({});
    this.storeData();
  }

  render(){
    return(
      <View style={{flex: 1}}>

        {/* statusbar */}
        <StatusBar backgroundColor="#2196f3" barStyle="light-content"/>

        {/* title */}
        <View style={{backgroundColor: "#2196f3", paddingVertical:15, elevation:1}}>
          <Text style={{color:"#ffffff", textAlign:'center', fontWeight:'bold', fontSize:18}}>TODOLIST</Text>
        </View>

        {/* list-todo */}
        <FlatList
          data={dataTodo}
          renderItem={ ({item, index}) =>

            /* item-todo */
            <TouchableOpacity
              style={{marginHorizontal:10, marginVertical:5, paddingVertical:15, borderRadius:5, backgroundColor:'#ffffff', elevation:2, flexDirection: 'row',}}
              onLongPress={() => this.setState({openModal: true, indexTodo: index, textTodo: item.todo})}
            >

              {/* text-todo */}
              <View style={{flex:1, justifyContent:'center'}}>
                <Text style={{marginLeft:10}}>{item.todo}</Text>
              </View>

              {/* checkbox-todo */}
              <Icon name={item.check ? "check-square" : "square"} size={30} color="#2196f3" style={{marginHorizontal:10}}
                onPress={() => this.check(index)}
              />
            </TouchableOpacity>
          }
          keyExtractor={(item) => item.todo}
          style={{flex: 1, backgroundColor:'#f5f5f5', paddingTop:10}}
        />

        {/* input-text-tambah-todo */}
        <Hoshi
          label={'Tambah Todo Baru'}
          borderColor={'#2196f3'}
          borderHeight={3}
          inputPadding={16}
          backgroundColor={'#F9F7F6'}
          value={this.state.newTodo}
          onChangeText={text => this.setState({newTodo: text}) }
          onSubmitEditing={() => this.state.editMode ? this.onSubmitEdit() : this.addNewTodo()}
        />

      {/* modal-edit-delete */}
        <Modal isVisible={this.state.openModal}>
          <View style={{backgroundColor:'#ffffff', padding:10, borderRadius:10}}>

            {/* button-edit */}
            <TouchableOpacity style={{ backgroundColor: '#2196f3', padding: 10, borderRadius: 5}}
              onPress={() => this.edit(this.state.textTodo)}
            >
              <Text style={{textAlign:'center', color:'#ffffff', fontWeight:'bold', fontSize:18}}>Edit</Text>
            </TouchableOpacity>

            {/* button-delete */}
            <TouchableOpacity style={{ backgroundColor: '#f44336', padding: 10, borderRadius: 5, marginVertical:10}}
              onPress={() => this.delete(this.state.indexTodo)}
            >
              <Text style={{textAlign:'center', color:'#ffffff', fontWeight:'bold', fontSize:18}}>Delete</Text>
            </TouchableOpacity>

            {/* button-cancel */}
            <TouchableOpacity style={{ backgroundColor: '#757575', padding: 10, borderRadius: 5}}
              onPress={() => this.setState({openModal: false})}
            >
              <Text style={{textAlign:'center', color:'#ffffff', fontWeight:'bold', fontSize:18}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

export default App;