using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Windows.Forms;

public class OpenFileByDll : MonoBehaviour {

    public void OpenFile()
    {
        OpenFileDialog dialog = new OpenFileDialog();
        dialog.Filter = "(*.jpg,*.png,*.jpeg,*.bmp,*.gif)|*.jgp;*.png;*.jpeg;*.bmp;*.gif|All files(*.*)|*.*";//"exe files (*.exe)|*.exe";  //过滤文件类型
        dialog.InitialDirectory = "D:\\";  //定义打开的默认文件夹位置，可以在显示对话框之前设置好各种属性
        if (dialog.ShowDialog() == DialogResult.OK)
        {
            Debug.Log(dialog.FileName);
        }
    }
}
