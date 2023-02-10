import { Picker } from "@react-native-picker/picker";
import { dummyapidata } from "./dummyData";
import { StatusBar } from "expo-status-bar";
import { useRef, useState, useEffect } from "react";
import { API_TOKEN } from "@env";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from "react-native";

export default function App() {
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState();
  const [availableCur, setAvailableCur] = useState({});

  const pickerRef = useRef();
  function open() {
    pickerRef.current.focus();
  }
  function close() {
    pickerRef.current.blur();
  }

  const count = () => {
    if (!availableCur) return;
    let r = availableCur[selectedCurrency];
    let calc = amount / r;
    setResult(Number.parseFloat(calc).toFixed(2));
  };

  var myHeaders = new Headers();
  myHeaders.append("apikey", API_TOKEN);

  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: myHeaders,
  };

  useEffect(() => {
    fetch(
      "https://api.apilayer.com/exchangerates_data/latest?symbols=GBP%2CJPY%2CUSD&base=EUR",
      requestOptions
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setAvailableCur(responseJson.rates);
        console.log(Object.keys(responseJson.rates) + " in useeffect");
      });
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text> {result}</Text>

        <TextInput
          style={styles.TextInput}
          placeholder="amount"
          keyboardType="numeric"
          onChangeText={(text) => setAmount(text)}
        ></TextInput>
        <Picker
          ref={pickerRef}
          style={styles.picker}
          selectedValue={selectedCurrency}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedCurrency(itemValue)
          }
        >
          {availableCur &&
            Object.keys(availableCur).map((cur) => (
              <Picker.Item label={cur} value={cur} />
            ))}
        </Picker>

        <Button title="convert" onPress={count}></Button>

        <StatusBar style="auto" />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    marginBottom: 70,
  },
  picker: {
    backgroundColor: "grey",
    borderWidth: 5,
    width: 300,
  },
  TextInput: {
    borderWidth: 3,
    width: 200,
  },
});
