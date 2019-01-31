using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;
using System;
using System.Linq;
using System.Reflection;

public class AutoToolScript
{
    static string ExtendedStart = "//extend_s";
    static string ExtendedEnd = "//extend_e";
    [MenuItem("策划工具/配置表/生成配置类")]
    static void CsvFileToCSharpClass()
    {
        string fromPath = Application.dataPath.Replace("Client-lua", "Client") + "/AssetsBundleRes/Config/";
        fromPath = EditorUtility.OpenFolderPanel("配置文件路径", fromPath, "");
        string to  = EditorUtility.OpenFolderPanel("导出类路径", fromPath, "");
        string url = to+"/";//Application.dataPath + "/Scripts/Csv/";
        if (!Directory.Exists(url))
        {
            Directory.CreateDirectory(url);
        }

        string[] files = Directory.GetFiles(fromPath, "*.csv");
        int flength = fromPath.Length + 1;
        List<string> ccs = new List<string>();
        for (int i = 0, iMax = files.Length; i < iMax; i++)
        {
            string file = files[i].Replace("\\", "/");
            string fileName = file.Substring(flength);
            //EditorUtility.DisplayProgressBar("生成配置类 Progress Bar", string.Format("正在生成{0}", file.Substring(flength)), (float)(i / iMax));
            ccs.Add(SaveToCSharp(file, fileName, url));
        }
        //生成ConfigMap//
        EditorUtility.ClearProgressBar();
        AssetDatabase.Refresh();
    }

    static string SaveToCSharp(string file, string fileName, string url)
    {
        string[] lines = File.ReadAllLines(file);
        if (lines.Length < 2)
        {
            Debug.LogError(file + "错误！！！");
            return "";
        }
        string className = fileName.Replace(".csv", "Csv");
        //创建数据类//
        //属性
        string[] variableName = lines[0].ToUpper().Split(',').Select(str => str.Trim()).ToArray();
        //类型
        string[] typeName = lines[1].ToLower().Split(',').Select(str => str.Trim()).ToArray();
        //注释
        string[] noteStr = lines[2].Split(',').Select(str => str.Trim()).ToArray();
        bool useNote = true;// CheckUseNote(typeName, noteStr);

        string code = "// TypeScript file\n\n";
        code += string.Format("////////////////////////////////\n/// {0}.cs——CSV信息类\n////////////////////////////////\n", className);
        string keyType = GetDataType(typeName[0]);
        string keyName = GetDataName(variableName[0], 0);

        code += string.Format("{0}class {1} implements CsvBase{{\n\n", "", className);
        StringBuilder setValue = new StringBuilder();
        StringBuilder attribute = new StringBuilder();

        setValue.Append(string.Format("{0}public line:Array<any>  = new Array<any>();\n", "\t"));
        setValue.Append(string.Format("{0}public SetValues(values:string[]):void\n", "\t"));
        setValue.Append("\t{\n");
        setValue.Append(string.Format("{0}let i = 0;\n", "\t\t"));

        //setValue.Append(string.Format("{0}if(values.Length < mColNum){ Debug.LogError(\"{1}\");return;}\n", "\t\t", className));
        //setValue.Append(string.Format("{0}if(values.Length < mColNum){{ Debug.LogError(\"{1}数据不足\");return;}}\n", "\t\t", className));
        for (int i = 0; i < typeName.Length; i++)
        {
            string vName = GetDataName(variableName[i], i);
            string tName = GetDataType(typeName[i]);
            if (tName == "string")
            {
                setValue.Append(string.Format("{0}this._{1} = {2};\n", "\t\t", vName, "values[i++]"));
                setValue.Append(string.Format("{0}this.line.push(this._{1});\n", "\t\t", vName));
            }
            else
            {
                setValue.Append(string.Format("{0}this._{1} = Number({2});\n", "\t\t", vName, "values[i++]"));
                setValue.Append(string.Format("{0}this.line.push(this._{1});\n", "\t\t", vName));
            }
            if (useNote && typeName.Length <= noteStr.Length)
            {

                attribute.Append("\t/**\n");
                attribute.Append(string.Format("\t* {0}\n", noteStr[i]));
                attribute.Append("\t*/\n");

            }

            attribute.Append(string.Format("{0}protected  _{1}:{2};\n", "\t", vName, tName));
            attribute.Append(string.Format("{0}public get {1}():{2} {{ return this._{3}}}\n\n", "\t",vName, tName,vName));
        }

        //if (typeName.Length > noteStr.Length)
        //{
        //    Debug.LogError(string.Format("注释有问题:{0}--->{1}", className, lines[2]));
        //}
        setValue.Append("\t}\n\n");

        string CSharpFile = string.Format("{0}{1}.ts", url, className);

        List<string> ss = GetCSharpExtend(CSharpFile);

        //public int mColNum = 0;
        code += setValue.ToString();
        code += string.Format("{0}public   ColNum():number{{return {1};}}\n\n", "\t",typeName.Length);
        code += attribute.ToString();
        code += string.Format("{0}\n\n", ExtendedStart);
        code += string.Format("{0}\n\n",ss[0]);
        code += string.Format("{0}\n\n", ExtendedEnd);
        code += "}\n\n";

        //创建对应的管理类//
        string manageName = className + "Manage";
        code += string.Format("////////////////////////////////\n/// {0}Manage.cs——CSV信息管理类\n////////////////////////////////\n", className);

        code += string.Format("{0}class {1} extends CsvBaseManager<{2},{3}>{{ \n\n", "", manageName, className, manageName);
        //public 东方红CsvManage(): base(){ Init();}
        //code += string.Format("{0}public {1}(): base(){{ Init();}}\n\n", "\t", manageName);

        code += string.Format("{0}public ConfigName():string{{ return \"{1}\";}}\n\n", "\t", fileName.Replace(".", "_"));
        code += string.Format("{0}public UseNote():boolean{{ return {1};}}\n\n", "\t", useNote.ToString().ToLower());
        code += string.Format("{0}public GetKeyCsv(cvs:{1}):any{{ return cvs.{2};}}\n\n", "\t", className, keyName);
        code += string.Format("{0}protected create():{1}{{ return new {2}();}}\n\n", "\t", className, className);
        code += string.Format("{0}\n\n", ExtendedStart);
        code += string.Format("{0}\n\n", ss[1]);
        code += string.Format("{0}\n\n", ExtendedEnd);
        code += "}\n";

        File.WriteAllText(CSharpFile, code);
        return manageName;
    }
    static List<string> GetCSharpExtend(string path)
    {
        List<string> s0 = new List<string>();
        string RelativePath = path.Substring(Application.dataPath.Length - 6);
        TextAsset result = AssetDatabase.LoadAssetAtPath<TextAsset>(RelativePath);
        int sl = ExtendedStart.Length;
        if (result != null)
        {
            int sid = 0;
            while(true)
            {
                int s = result.text.LastIndexOf(ExtendedStart, sid);
                if (s != -1)
                {
                    int e = result.text.LastIndexOf(ExtendedEnd,s);
                    s0.Add(result.text.Substring(s+ sl,e-s));
                    sid = e;
                }
                else
                {
                    break;
                }
                
            }
        }
        else
        {
            s0.Add("public OnInit():void{};");
            s0.Add("");
        }
        return s0;
    }
    
    static string GetDataType(string tName)
    {
        if (string.IsNullOrEmpty(tName) || tName == " ")
        {
            //没配类型则默认为string
            tName = "string";
        }
        else
        {
            tName = tName.ToLower();
            if (tName == "uint64")
            {
                tName = "UInt64";
            }
        }
        return tName;
    }
    static string GetDataName(string vName, int i)
    {

        if (string.IsNullOrEmpty(vName) || vName == " ")
        {
            //替换空的属性名字
            vName = "Null" + i.ToString();
        }
        else
        {
            //除掉空格//
            vName = vName.Replace(" ", "");
        }
        return vName;
    }
    //检测是否配有注释
    static bool CheckUseNote(string[] typeName, string[] noteStr)
    {
        bool ret = false;
        //出现一个类型和值不匹配则代表这行是配的注释
        for (int i = 0, iMax = typeName.Length; i < iMax; i++)
        {
            string tName = GetDataType(typeName[i]);
            string nStr = noteStr[i];
            if (tName == "int")
            {
                int ii;
                if (!int.TryParse(nStr, out ii))
                {
                    ret = true;
                    break;
                }
            }
            else if (tName == "float")
            {
                float ii;
                if (!float.TryParse(nStr, out ii))
                {
                    ret = true;
                    break;
                }
            }
            else if (tName == "UInt64")
            {
                UInt64 ii;
                if (!UInt64.TryParse(nStr, out ii))
                {
                    ret = true;
                    break;
                }
            }
        }
        return ret;
    }
    [MenuItem("策划工具/配置表/检测配置")]
    static void CheckCSharpClass()
    {
        Assembly assembly = Assembly.GetExecutingAssembly();
        string cp = string.Format("{0},Assembly-CSharp", "ConfigMap");
        Type ConfigMap = Type.GetType(cp);
        MethodInfo Register = ConfigMap.GetMethod("Register");
        Register.Invoke(null,null);
    }
   
    static void GetTransformPath(Transform t,ref Dictionary<string, string> map,string p = "")
    {
        //string p0 = string.Format("{0}{1}/",p,t.name);
        for (int i = 0, imax = t.childCount; i < imax; i++)
        {
            Transform c = t.GetChild(i);
            string n = c.name;
            if (n.StartsWith("_"))
            {
                map.Add(n, p + n);
            }
            string p0 = string.Format("{0}{1}/", p, n);
            GetTransformPath(c, ref map, p0);
        }
    }
   
    static string GetGameobjPath(Transform p)
    {
        string ret = p.name;
        if (p.parent != null)
        {
            ret = GetGameobjPath(p.parent) + "/" + ret;
        }
        return ret;
    }
}
