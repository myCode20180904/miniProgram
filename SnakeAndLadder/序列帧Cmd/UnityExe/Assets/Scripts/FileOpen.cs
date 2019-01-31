using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;

public class FileOpen : MonoBehaviour{

    [MenuItem("Custom/OpenFile")]
    public static void OpenFile()
    {
        string file = EditorUtility.OpenFilePanel("Open File Dialog", "D:\\", "exe");
        Debug.Log(file);
    }

    [MenuItem("Custom/OpenFolder")]
    public static void OpenFolder()
    {
        string file = EditorUtility.OpenFolderPanel("Open Folder Dialog", "D:\\", "unity");
        Debug.Log(file);
    }
}
