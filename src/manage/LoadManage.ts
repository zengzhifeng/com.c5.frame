/**
 * Created by Administrator on 2015/5/25.
 */
class LoadManage{
    static instance:LoadManage;
    private _loadArr:string[];
    private _view:any;
    private _totalLoad:number = 0;
    private _curLoad:number = 0;
    public constructor(){
        if( LoadManage.instance != null ){
            throw new TypeError("LoadManage Singleton already constructed")
        }
        LoadManage.instance = this;
    }

    static GetInstance():LoadManage{
        if( LoadManage.instance == null ){
            LoadManage.instance = new LoadManage();
        }

        return LoadManage.instance;
    }

    public Init():void{
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
    }

    public StartLoad(arr:string[],classView:any):void{
        if( classView ){
            this._loadArr = arr;
            this._view = new classView();
            egret.gui.PopUpManager.addPopUp(<egret.gui.IVisualElement>this._view);

            this._totalLoad = this.getTotalNeedLoad(this._loadArr);
            this._curLoad = 0;

            var count:number = this._loadArr.length;
            for( var i:number=0;i<count;i++ ){
                RES.loadGroup(this._loadArr[i],i);
            }
        }
    }

    private onResourceLoadComplete( e:RES.ResourceEvent ):void{
        if( this._curLoad >= this._totalLoad ){

            this.endLoad();
        }
    }

    private endLoad():void{
        if( this._view ){
            egret.gui.PopUpManager.removePopUp(this._view);
            this._view = null;
            GameResponse.GetInstance().LoadComplete();
        }
        this._loadArr = null;
    }

    private onResourceProgress( e:RES.ResourceEvent ):void{
        if( this._loadArr.indexOf(e.groupName) != -1 ){
            this._curLoad = this._curLoad + 1;
            GameResponse.GetInstance().LoadProgress(this._curLoad,this._totalLoad);
        }
    }

    public GetView():any{
        return this._view;
    }

    private getTotalNeedLoad(arr:string[]):number{
        var num:number = 0;
        var count:number = arr.length;
        for( var i:number=0;i< count;i++ ){
            var rArr = RES.getGroupByName(arr[i]);
            num = num + rArr.length;
        }
        return num;
    }
}