using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
using UnityEngine;
using UnityEngine.UI;
public class Export : MonoBehaviour {

    public GameObject FolderBtn;
    public GameObject PatchInput;
    public GameObject ExportBtn;
    public GameObject TextureMergerInput;
    public GameObject TextureMergerBtn;
    public GameObject OutInput;
    public GameObject OutBtn;
    const string DefaultDir = "DefaultDir";
    const string TextureMerger = "TextureMerger";
    const string Out = "Out";
    void Start () {
        SetInputBtn(DefaultDir, PatchInput, FolderBtn);
        SetInputBtn(TextureMerger, TextureMergerInput, TextureMergerBtn);
        SetInputBtn(Out, OutInput, OutBtn);
        InputField pInput = PatchInput.GetComponent<InputField>();
        InputField pOutInput = OutInput.GetComponent<InputField>();
        InputField tInput = TextureMergerInput.GetComponent<InputField>();
        EventTriggerListener.Get(ExportBtn).onClick = delegate
        {
            StringBuilder add = new StringBuilder();
            string sSourcePath = pInput.text;
            string sOutPath = pOutInput.text;
            DirectoryInfo Dir = new DirectoryInfo(sSourcePath);
            List<string> os = new List<string>();
            GetFolders(sSourcePath, os);
            int index = sSourcePath.Length;
            string sSimple = sSourcePath.Replace("\\", "_");
            sSimple = sSimple.Replace(":", "");
            Debug.Log(sSimple);

            string sFolder = sOutPath + "\\"+ sSimple;
            if (!Directory.Exists(sFolder))
            {
                Directory.CreateDirectory(sFolder);
            }

            string pan = tInput.text.Split(':')[0];
            add.Append(string.Format("{0}:\n", pan));
            add.Append(string.Format("cd {0}\n", tInput.text));
            for (int i = 0; i < os.Count; i++)
            {
                string folder = os[i];
                string outfolder = folder.Substring(index + 1);
                add.Append(string.Format("TextureMerger -p {0} -o {1}\\{2}.json\n", folder, sFolder, outfolder.Replace("\\", "_")));
                Debug.Log(string.Format("TextureMerger -p {0} -o {1}\\{2}.json\n", folder, sFolder, outfolder));
            }
            add.Append("pause");

            string str = add.ToString();

            //byte[] bytes = System.Text.Encoding.UTF8.GetBytes(str);
            //str = System.Text.Encoding.ASCII.GetString(bytes);
            string CSharpFile = string.Format("{0}.bat", sFolder);

            File.WriteAllText(CSharpFile, str);
        };
    }
	
    void SetInputBtn(string key, GameObject put, GameObject btn)
    {
        InputField pInput = put.GetComponent<InputField>();
        if (PlayerPrefs.HasKey(key))
        {
            pInput.text = PlayerPrefs.GetString(key);
        }
        pInput.onValueChanged.AddListener(delegate (string s)
        {
            PlayerPrefs.SetString(key, s);
        });
        EventTriggerListener.Get(btn).onClick = delegate
        {
            string sSourcePath = OpenDialogFile1.DllOpenFileDialog.QQ();
            pInput.text = sSourcePath;
        };
    }
    void GetFolders(string f,List<string> outFs)
    {
        DirectoryInfo Dir = new DirectoryInfo(f);
        DirectoryInfo[] dirInfo = Dir.GetDirectories();
        if(dirInfo == null || dirInfo.Length == 0)
        {
            outFs.Add(f);
        }
        else
        {
            for(int i = 0; i < dirInfo.Length;i++)
            {
                DirectoryInfo df = dirInfo[i];
                GetFolders(df.FullName, outFs);
            }
            //string[] files = Directory.GetFiles(f, "*.png");//"*.*"
            FileInfo[] thefileInfo = Dir.GetFiles("*.png", SearchOption.TopDirectoryOnly);
            if (thefileInfo != null && thefileInfo.Length > 0)
            {
                outFs.Add(f);
            }
        }

    }
	// Update is called once per frame
	void Update () {
		
	}
}
