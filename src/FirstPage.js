import React from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "./utils.js";

function FirstPage(props) {
    const navigate = useNavigate();

  var onSubmit = () => {
    // Submit form results
    navigate("/mainpage", { replace: true })
    // writeAsyncFunction();
  };

  var writeAsyncFunction = async () => {
    /*try {
        const docRef = await addDoc(collection(db, "robots", "UTB-Tele-Bot"), {
          available: false,
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }*/
    try {
      const docRef = doc(db, "robots", "UTB-Tele-Bot");
      await updateDoc(docRef, {
        available: true
      });
      console.log("Document update with ID: ", docRef.id);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  return (
    <div>
      <button onClick={onSubmit}>Press me</button>
    </div>
  );
}

export default FirstPage;
