<?php
/**************************************************************************************
Coder  : Anil Agal
Object : General functioning which will be shared by all site controller
**************************************************************************************/
/*
 * @property Packages $Packages
 * @property commonComponent $common
 * */
class AppController{

    var $components = array('common','Session');

    function __construct()
    {
        parent::__construct();
    }

    public function _logArray( $array = array(), $prefix = NULL )
    {
        $this->autoRender = false;
        if ( is_array( $array ) ) {
            foreach ( $array as $k => $v ) {
                $p =  $prefix . '[ ' . $k . ' ]';
                if ( is_array( $v ) ) {
                    $this->_logArray( $v, $p );
                } else {
                    CakeLog::write( LOG_INFO, $p . ' => ' . (string)$v );
                }
            }
        } else {
            CakeLog::write( LOG_INFO, $prefix . ' => ' . (string)$array );
        }
    }


    public function afterPaypalNotification( $feeID = 0 )
    {
        $this->autoRender = false;
        $this->loadModel( 'PaypalIpn.InstantPaymentNotification' );
        $result = $this->InstantPaymentNotification->findById( $feeID );
        $notification = $result['InstantPaymentNotification'];
        $fee = $notification['payment_gross'];
        $id = 0;
        if ( isset( $_GET['id'] ) ) {
            $id = $_GET['id'];
        }
        $type = "";
        if ( isset( $_GET['type'] ) ) {
            $type = $_GET['type'];
        }
        $receiver = Configure::read('paypalAccount');
$this->_logArray($receiver,"RECEIVER_CONFIG");
$this->_logArraY($notification['receiver_email'],"RECEIVER_POST"); 
        if ( $notification['receiver_email'] == $receiver ) {
            switch ( $type ){
                case 'urgent':
//Upgrade in table Shipments
                    $this->loadModel( 'Shipment' );
                    $this->Shipment->read(null, $id);
                    $this->Shipment->set( 'urgent_listing', 'yes' );
                    $this->Shipment->save();
                    $result = $this->Shipment->findById( $id );
                    $shipment = $result['Shipment'];
//Write in table Orders
                    $this->common->saveOrder(
                        $fee,
                        0,
                        $shipment['user_id'],
                        'Payment of upgrade Shipment : "' . $shipment['shipment_title'] . '" (' . $shipment['id'] . ') to Urgent listing.'

                    );
//Write in table Messages
                    $this->loadModel( 'User' );
                    $result = $this->User->findById( $shipment['user_id'] );
                    $user = $result['User'];
                    $subject = 'Your listing has been upgraded to urgent listing on ShippingPlanner';
                    $bodyText = 'Your listing ' . $shipment['shipment_title'] . ' has been upgraded to urgent listing on ShippingPlanner';
                    $this->common->saveInboxMessage(
                        $user['id'],
                        $user['username'],
                        $subject,
                        $bodyText
                    );
//Write in table Paymentlogs
                    $this->loadModel('Paymentlog');
                    $paymentLogArr['Paymentlog']['user_id'] = $user['id'];
                    $paymentLogArr['Paymentlog']['amount'] = $fee;
                    $paymentLogArr['Paymentlog']['model_name'] = 'Shipment';
                    $paymentLogArr['Paymentlog']['model_id'] = $shipment['id'];
                    $paymentLogArr['Paymentlog']['ip'] = '';
                    $paymentLogArr['Paymentlog']['description'] = '$' . $fee . ' deducted from fund against urgent status of listing. Shipment listing id is .' . $shipment['id'];
                    $this->Paymentlog->save( $paymentLogArr );
                    break;
                case 'featured':
//Upgrade in table Shipments
                    $this->loadModel( 'Shipment' );
                    $this->Shipment->read(null, $id);
                    $this->Shipment->set( 'featured_listing', 'yes' );
                    $this->Shipment->save();
                    $result = $this->Shipment->findById( $id );
                    $shipment = $result['Shipment'];
//Write in table Orders
                    $this->common->saveOrder(
                        $fee,
                        0,
                        $shipment['user_id'],
                        'Payment of featured Shipment : "' . $shipment['shipment_title'] . '" (' . $shipment['id'] . ') to Featured listing.'

                    );
//Write in table Messages
                    $this->loadModel( 'User' );
                    $result = $this->User->findById( $shipment['user_id'] );
                    $user = $result['User'];
                    $subject = 'Your listing has been upgraded to feature listing on ShippingPlanner';
                    $bodyText = 'Your listing ' . $shipment['shipment_title'] . ' has been upgraded to feature listing on ShippingPlanner';
                    $this->common->saveInboxMessage(
                        $user['id'],
                        $user['username'],
                        $subject,
                        $bodyText
                    );
//Write in table Paymentlogs
                    $this->loadModel('Paymentlog');
                    $paymentLogArr['Paymentlog']['user_id'] = $user['id'];
                    $paymentLogArr['Paymentlog']['amount'] = $fee;
                    $paymentLogArr['Paymentlog']['model_name'] = 'Shipment';
                    $paymentLogArr['Paymentlog']['model_id'] = $shipment['id'];
                    $paymentLogArr['Paymentlog']['ip'] = '';
                    $paymentLogArr['Paymentlog']['description'] = '$' . $fee . ' deducted from fund against feature status of listing. Shipment listing id is .' . $shipment['id'];
                    $this->Paymentlog->save( $paymentLogArr );
                    break;
                case 'shipment':
$this->_logArray("BEGIN","SHIPMENT_FEE");
//Upgrade in table Shipments
                    $this->loadModel( 'Shipment' );
                    $this->Shipment->read(null, $id);
                    $this->Shipment->set( 'status', 'freezed' );
                    $this->Shipment->set( 'fee_id', $feeID );
                    $this->Shipment->save();
                    $result = $this->Shipment->findById( $id );
$this->_logArray($result,"SHIPMENT_FEE");
                    $shipment = $result['Shipment'];
//Write in table Orders
                    $this->common->saveOrder(
                        $fee,
                        0,
                        $shipment['user_id'],
                        "Payment against Shipment fee: " . $shipment['shipment_title']
                    );
//Write in table Messages
                    $this->loadModel( 'User' );
                    $result = $this->User->findById( $shipment['user_id'] );
                    $user = $result['User'];
                    $subject = 'Shipment fee charge';
                    $bodyText = 'Shipment fee $' . $fee . ' charges from your account againts the selected shipment ' . $shipment['shipment_title'];
                    $bodyText .= '" (' . $shipment['id'] . ' )';
                    $this->common->saveInboxMessage(
                        $user['id'],
                        $user['username'],
                        $subject,
                        $bodyText
                    );
//Write in table Paymentlogs
                    $this->loadModel('Paymentlog');
                    $paymentLogArr['Paymentlog']['user_id'] = $user['id'];
                    $paymentLogArr['Paymentlog']['amount'] = $fee;
                    $paymentLogArr['Paymentlog']['model_name'] = 'Shipment Fee';
                    $paymentLogArr['Paymentlog']['model_id'] = $shipment['id'];
                    $paymentLogArr['Paymentlog']['ip'] = '';
                    $paymentLogArr['Paymentlog']['description'] = '$' . $fee . ' deducted from fund against shipment fees . shipment listing id is .' . $shipment['id'];
                    $this->Paymentlog->save( $paymentLogArr );
$this->_logArray("END","SHIPMENT_FEE");
                    break;
                case 'banner':
//Upgrade in table Banner
                    $this->loadModel( 'Banner' );
                    $sql = "
                        UPDATE
                            banners
                        SET
                            fee_id='" . $feeID . "'
                        WHERE
                            id=" . $id . "
                    ";
                    $this->Banner->query( $sql );
                    $result = $this->Banner->findById( $id );
                    $banner = $result['Banner'];
                    $note = '$'.$fee .' deducted from fund against Banner Management.';
//Write in table Orders
                    $orderArr['amount'] 		  = $fee;
                    $orderArr['receiver_user_id'] = 0;
                    $orderArr['sender_user_id']   = $banner['user_id'];
                    $orderArr['description'] 	  = $note;
                    $orderArr['payment_status']   = 'complete';
                    $orderArr['transaction_id']   = 0;
                    $this->LoadModel('Order');
                    $this->Order->save($orderArr);
//Send email
                    $this->loadModel( 'User' );
                    $result = $this->User->findById( $banner['user_id'] );
                    $user = $result['User'];
                    $arrayTags = array(
                        "[BANNER_ID]",
                        "[BANNER_TITLE]",
                        "[CREATED_DATE]"
                    );
                    $arrayReplace = array(
                        $banner['id'],
                        $banner['line_one'],
                        $banner['created']
                    );
                    $this->loadModel('EmailTemplate');
                    $emailTemplateDet = $this->EmailTemplate->find('first',array('conditions'=>array('EmailTemplate.id'=>41)));
                    $subject 	= str_replace($arrayTags,$arrayReplace,$emailTemplateDet['EmailTemplate']['subject']);
                    $bodyText 	= str_replace($arrayTags,$arrayReplace,$emailTemplateDet['EmailTemplate']['msg']);
                    $this->Email->to 		= ADMIN_EMAIL;
                    $this->Email->subject 	= strip_tags($subject);
                    $this->Email->replyTo 	= ADMIN_EMAIL;
                    $this->Email->from 		= EMAIL_FROM_ID;
                    $this->Email->sendAs 	= 'html';
                    $this->body = '';
                    $this->body .= str_replace('../../',FULL_BASE_URL.Router::url('/', false), $bodyText);
                    $this->body .= "<br />".FULL_BASE_URL.Router::url('/', false);
                    $this->Email->send($this->body);
//Write in table Paymentlogs
                    $this->loadModel('Paymentlog');
                    $paymentLogArr['Paymentlog']['user_id'] = $user['id'];
                    $paymentLogArr['Paymentlog']['amount'] = $fee;
                    $paymentLogArr['Paymentlog']['model_name'] = 'Banner';
                    $paymentLogArr['Paymentlog']['model_id'] = $banner['id'];
                    $paymentLogArr['Paymentlog']['ip'] = '';
                    $paymentLogArr['Paymentlog']['description'] = $note;
                    $this->Paymentlog->save( $paymentLogArr );
                    break;
            }
        }
    }




	/* Function to call for set cookie for theme name */
    function admin_setCss($id) {
		$this->Cookie->delete('css_name');
		if($this->params['pass'][0]=='0'){
		   $this->Cookie->write('css_name','theme',false);
		   $this->redirect(array('action' => $this->params['pass'][1]));
		}else{
		   $this->Cookie->write('css_name','theme'.$this->params['pass'][0],false);
		   $this->redirect(array('action' => $this->params['pass'][1]));
		}
	}
	/* Function beforeFilter execute before controller logic work */
	function beforeFilter() {
    if($this->params['controller'] != 'users' && $this->params['action'] != 'profile') {
		if($this->Session->read('listcount')) {
			$this->Session->delete('listcount');
		}
	}
    if($this->params['controller'] != 'shipments' && $this->params['action'] != 'listing') {
		if($this->Session->read('listingcount')) {
			$this->Session->delete('listingcount');
		}
	}	
	    //File to call for php settings
	   	//Configure::load('messages');
		APP::import('Model','Setting');
		$this->Setting = new Setting();
		$lists = $this->Setting->find('all',array('fields'=>array('name','value')));
		$uesrId = (int)$this->Session->read('Auth.User.id');
		//How to read variables 
		 //Configure::read('Company.slogan');
		 foreach($lists as $list) {
			if(!defined($list['Setting']['name'])) {
			   define($list['Setting']['name'],$list['Setting']['value']);
			}
		 }	
		 if($this->Session->read('Auth.User.user_type')=='shipper') {
		 	$this->loadModel('Shipment');
		 	$shipmentFilters = $this->Shipment->filterCount($this->Session->read('Auth.User.id')); 
			$shipmentFilters['active'] = $this->Shipment->find('count',array('conditions'=>array('Shipment.user_id'=>$this->Session->read('Auth.User.id'),'Shipment.status'=>'active')));
		 	//pr($shipmentFilters);
		 	$this->set('shipmentFilters',$shipmentFilters);
		 }
		 if($this->Session->read('Auth.User.user_type')=='provider') {
		 	 $this->loadModel('Bid');
			 $bidsFilters['process'] = $this->Bid->find('count',array('conditions'=>array('Bid.status'=>'active','Bid.user_id'=>$uesrId,'Shipment.status'=>'process','Shipment.selected_provider_id'=>$uesrId,array('Bid.id=Shipment.bid_id'))));
			 $bidsFilters['sel-bids'] = $this->Bid->find('count',array('conditions'=>array('Bid.status'=>'active','Bid.user_id'=>$uesrId,'Shipment.status'=>'sel-bids','Shipment.selected_provider_id'=>$uesrId,'Shipment.bid_id = Bid.id')));
			 $bidsFilters['active-bids'] = $this->Bid->find('count',array('conditions'=>array('Bid.status'=>'active','Bid.user_id'=>$uesrId,'Shipment.status'=>'active')));
			 $bidsFilters['freezed'] = $this->Bid->find('count',array('conditions'=>array('Bid.status'=>'active','Bid.user_id'=>$uesrId,'Shipment.status'=>'freezed',array('Bid.id=Shipment.bid_id'))));
			 $bidsFilters['closed'] = $this->Bid->find('count',array('conditions'=>array('Bid.status'=>'active','Bid.user_id'=>$uesrId,'Shipment.status'=>'closed','Shipment.selected_provider_id'=>$uesrId)));
			 $bidsFilters['active-bids'] = $this->Bid->find('count',array('conditions'=>array('Bid.status'=>'active','Bid.user_id'=>$uesrId,'Shipment.status'=>'active')));
			 $bidsFilters['shipperapproval'] = $this->Bid->find('count',array('conditions'=>array('Shipment.selected_provider_id'=>$uesrId,'Bid.status'=>'active','Bid.user_id'=>$uesrId,'Shipment.status'=>'shipperapproval',array('Bid.id=Shipment.bid_id'))));
             $bidsFilters['all'] = $this->Bid->find('count',array('conditions'=>array('Bid.status'=>'active','Bid.user_id'=>$uesrId)));
		 	 //pr($bidsFilters);
		 	 $this->set('bidsFilters',$bidsFilters);
		 }
		 
		 if($this->Session->read('Auth.User.user_type')=='broker') {
		 
		 $this->loadModel('Shipment');
		 	$shipmentFilters = $this->Shipment->filterCountbroker($this->Session->read('Auth.User.id')); 
			$shipmentFilters['active'] = $this->Shipment->find('count',array('conditions'=>array('Shipment.user_id'=>$this->Session->read('Auth.User.id'),'Shipment.status'=>'active')));
		 	//pr($shipmentFilters);
		 	$this->set('shipmentFilters',$shipmentFilters);		
			
		 	 $this->loadModel('Bid');
			 $bidsFilters['process'] = $this->Bid->find('count',array('conditions'=>array(
                 'Bid.user_id'=>$uesrId,
                 'Bid.status'=>'active',
                 'Shipment.status'=>'process',
                 'Shipment.selected_provider_id'=>$uesrId,
                 array('Bid.id=Shipment.bid_id')
             )));
			 $bidsFilters['sel-bids'] = $this->Bid->find('count',array('conditions'=>array('Bid.status'=>'active','Bid.user_id'=>$uesrId,'Shipment.status'=>'sel-bids','Shipment.selected_provider_id'=>$uesrId,'Shipment.bid_id = Bid.id')));
			 $bidsFilters['active-bids'] = $this->Bid->find('count',array('conditions'=>array('Bid.status'=>'active','Bid.user_id'=>$uesrId,'Shipment.status'=>'active')));
			 $bidsFilters['freezed'] = $this->Bid->find('count',array('conditions'=>array('Bid.status'=>'active','Bid.user_id'=>$uesrId,'Shipment.status'=>'freezed',array('Bid.id=Shipment.bid_id'))));
			 $bidsFilters['closed'] = $this->Bid->find('count',array('conditions'=>array('Bid.status'=>'active','Bid.user_id'=>$uesrId,'Shipment.status'=>'closed','Shipment.selected_provider_id'=>$uesrId)));
			 $bidsFilters['active-bids'] = $this->Bid->find('count',array('conditions'=>array('Bid.status'=>'active','Bid.user_id'=>$uesrId,'Shipment.status'=>'active')));
			 $bidsFilters['shipperapproval'] = $this->Bid->find('count',array('conditions'=>array(
                 'Bid.status'=>'active',
                 'Bid.user_id'=>$uesrId,
                 'Shipment.status'=>'shipperapproval',
                 'Shipment.selected_provider_id'=>$uesrId,
                 array('Bid.id=Shipment.bid_id')
             )));
             $bidsFilters['shipperapprovalpending'] = $this->Bid->find('count',array('conditions'=>array('Bid.status'=>'active','Bid.user_id'=>$uesrId,'Shipment.status'=>'shipperapprovalpending')));
             $bidsFilters['all'] = $this->Bid->find('count',array('conditions'=>array('Bid.status'=>'active','Bid.user_id'=>$uesrId)));
		 	 //pr($bidsFilters);
		 	 $this->set('bidsFilters',$bidsFilters);
		 }		 
		 
		 //Find unread messages in inbox of log in user
		 if($uesrId) {
		 	$this->loadModel('Message');
			$inboxMsg = $this->Message->find('count',array('conditions'=>array('Message.message_read'=>1,'from_status' => 1,'Message.to_user'=>$uesrId)));
			$this->set('inboxMsg',$inboxMsg);
		 }
		 $this->userpermissions    =	array();
		 if($this->Session->read('Auth.Adminuser.role')!='super admin') {
		 //Allowed function which exclude from check
		 $excludeArr = array('adminusers/home','adminshipments/subcategory','adminshipments/userinfo','adminshipments/savedata','adminshipments/downloadFile','adminshipments/subhourseholdgoods','shipments/subcategory','adminshipments/houseoffice','adminshipments/subvehicles','adminshipments/yearsFromCarDb','adminshipments/makelist','adminshipments/modellist','adminshipments/recreation','adminshipments/vehiclepart','adminshipments/heavyvehicles','adminshipments/motorcycle','adminshipments/boats','adminshipments/heavyequipment','adminshipments/lesstruckload','adminshipments/fulltruckload','adminshipments/businessgoods','adminshipments/patcats','adminshipments/patdogs','adminshipments/horses','adminshipments/foods','adminshipments/pickupinfo','adminusers/login','adminusers/logout','adminshipments/listoptions','adminshipments/saveModelInformation','adminshipments/setEbayItemInfo','funds/index','adminshipments/completelisting','adminshipments/shipmentinfo');
		 if(isset($this->params['prefix']) && $this->params['prefix']=='admin' && $this->Session->read('Auth.Adminuser.id')) {
		    $this->loadModel('Adminuser');
		 	$permissionsRes = $this->Adminuser->field('allowedfunctions',array('Adminuser.id'=>$this->Session->read('Auth.Adminuser.id')));
			if($permissionsRes) {
			     $permissionsRes = strtolower(str_replace('{self}',$this->Session->read('Auth.Adminuser.id'),$permissionsRes));
				 $this->userpermissions    = explode(',',$permissionsRes);
			}
			$functionname = $this->params['controller'].'/'.substr($this->params['action'],6);
			if($functionname=='adminusers/editadminuser' && isset($this->params['pass'][0])) {
				$functionname = $functionname.'/'.$this->params['pass'][0];
			}
		 
		//  pr($this->params);
			 if(in_array(strtolower($functionname),$excludeArr)) {
			 }
			 else if(!in_array(strtolower($functionname),$this->userpermissions)) {
			 //echo $functionname;
			 //print_r($this->userpermissions);
			 //exit;
				 $this->Session->setFlash('You have no permission to access this function -'.$functionname);
				 $this->redirect(array('controller'=>'adminusers','action'=>'home/message:error'));
			  }
			}
		 }
		 $this->set('userpermissions',$this->userpermissions);
		 //$this->checkAdminPermissions('');
        if(isset($this->common)){
		 $this->set('common',$this->common);
        }

		//echo Configure::read('DATE_FORMAT');
	 }
	/* Function beforeFilter end */
	/* Function beforeRender execute before controller design view render */
	function beforeRender() {
        if ( isset( $_SERVER['HTTP_X_REQUESTED_WITH'] ) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest' ) {
            if ( isset( $_SERVER['HTTP_TYPEREQUESTAJAX'] ) && $_SERVER['HTTP_TYPEREQUESTAJAX'] == 'validate'  ){
                if ( isset( $_SESSION['Message']['flash']['message'] ) && $_SESSION['Message']['flash']['message'] != '' ) {
                    echo $_SESSION['Message']['flash']['message'];
                    unset( $_SESSION['Message']['flash'] );
                    exit;
                }
                echo 'true';
                exit;
            }
        }
        $this->set('prefixName','');
		$this->set('withoutPrefixAction','');
		$this->set('controllerName',$this->params['controller']);
		if($this->Session->check('Auth.Adminuser')){
		   $adminLogin = 1;
		}
		else {
		  $adminLogin = 0;
		}
		$this->set('adminLogin',$adminLogin);
		//If prefix set for admin then
		if(isset($this->params['prefix']) && $this->params['prefix']=='admin') {
		   $prefixName = 'admin';
		   $withoutPrefixAction = substr($this->params['action'],6);
		   $this->set('prefixName',$prefixName);
		   $this->set('withoutPrefixAction',$withoutPrefixAction);
		}
		 APP::import('Helper','Pagelink'); 
		 $pagelink =  new PagelinkHelper();
		 $this->set('pagelinkhelper',$pagelink);
	}
	/* Function beforeRender end */
	/************* Function to check user login and credential
	return try if user is right and meed requirement
	esle return false
	 ************/
	function userCheck($user_type) {
		if($this->Session->read('Auth.User.id') && $this->Session->read('Auth.User.user_type') == $user_type) {
		   return true;
		}
		else {
		   return false;
		}
	}
	/* Download function path if folder any folder in img path */
	function downloadFile($folder,$fielname)	{
		$this->autoLayout = false;
		$newFileName = $fielname;
	    $path =  WWW_ROOT.'img/'.$folder.'/'.$fielname;
		if(file_exists($path) && is_file($path)) {	
			$mimeContentType = 'application/octet-stream';
			$temMimeContentType = $this->_getMimeType($path); 
			if(isset($temMimeContentType)  && !empty($temMimeContentType))	{ 
							$mimeContentType = $temMimeContentType;
			}
		    //echo  'sssssssssss--->' . $mimeContentType;		 exit;
			// START ANDR SILVA DOWNLOAD CODE
			// required for IE, otherwise Content-disposition is ignored
			if(ini_get('zlib.output_compression'))
			  	ini_set('zlib.output_compression', 'Off');
			header("Pragma: public"); // required
			header("Expires: 0");
			header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
			header("Cache-Control: private",false); // required for certain browsers 
			header("Content-Type: " . $mimeContentType );
			// change, added quotes to allow spaces in filenames, by Rajkumar Singh
			header("Content-Disposition: attachment; filename=\"".(is_null($newFileName)?basename($path):$newFileName)."\";" );
			header("Content-Transfer-Encoding: binary");
			header("Content-Length: ".filesize($path));
			readfile($path);
			exit();
			// END ANDR SILVA DOWNLOAD CODE												
		 }
		 if(isset($_SERVER['HTTP_REFERER'])) {
		 	 $this->Session->setFlash('File not found.');
			 $this->redirect($_SERVER['HTTP_REFERER']);
		 }	 
 	}
	
	function _getMimeType($filepath) {
		ob_start();
		system("file -i -b {$filepath}");
		$output = ob_get_clean();
		$output = explode("; ",$output);
		if ( is_array($output) ) {
			$output = $output[0];
		}
		return $output;
	}
	/* Fucntion to get authorization */
	function checkAdminPermissions($functionname) {
		return in_array($functionname,$this->userpermissions);
	}


}//Class ends
?>
