<?php

/**
 * Project:     FineCRM
 * Author:      Sergiy Lavryk (jagermesh@gmail.com)
 *
 * @version 1.0.0.0
 * @package FineCRM
 */

require_once(GENERIC_PATH."ui/browser.php");

class browser_invoice_project extends browser {

  function do_setup() {

    global $url;
    global $db;
    global $acc;
    global $auth;

    $this->sql = sql_placeholder("SELECT prj.id".
                                 "     , prj.name".
                                 "     , SUM(inp.duration) / 60 duration".
                                 "     , SUM(inp.sum_) sum_".
                                 "  FROM work wrk INNER JOIN invoice_position inp ON inp.work_id = wrk.id".
                                 "                INNER JOIN task tsk             ON wrk.task_id = tsk.id".
                                 "                INNER JOIN project prj          ON tsk.project_id = prj.id".
                                 " WHERE inp.invoice_id = ?".
                                 " /*filter*/".
                                 " GROUP BY prj.id".
                                 " /*order*/"
                                 , $this->bind_key()
                                 );

    $this->table = "project";
    $this->title = "Projects";

    $this->add_capability("export");
    $this->add_capability("sort");

    $this->add_column(array ( "field"         => "name"
                            , "header"        => "Name"
                            , "sortable"      => true
                            , "default_order" => "ASC"
                            , "width"         => "1000"
                            ));
    $this->add_column(array ( "field"    => "duration"
                            , "header"   => "Duration"
                            , "sortable" => true
                            , "width"    => "80"
                            , "summary"  => "sum"
                            ));
    $this->add_column(array ( "field"    => "sum_"
                            , "header"   => "Sum"
                            , "sortable" => true
                            , "width"    => "80"
                            , "summary"  => "sum"
                            ));

    if ($auth->user_type != "c") 
      $this->add_column(array ( "name"  => "detach"
                              , "type"   => "button"
                              , "title"  => "Detach project from invoice"
                              , "image"  => "detach_work.gif"
                              , "action" => "post_back"
                              , "post_back_event_name"   => "detach_project"
                              , "post_back_event_value"  => PLACEHOLDER_KEY
                              , "post_back_confirmation" => "Are you sure you want to detach this project from invoice?"
                              ));
  }

  function do_draw_custom_column($name, $row) {

    global $ui;
    global $db;
    global $auth;
    switch($name) {
      case "name":
        $result = "";
        $result .= "<a class=\"default_href\" href=\"javascript:".$this->post_back("rolldown", $row["id"])."\">";
        $result .= $row["name"];
        $result .= "</a>";
        return $result;
        break;
    }

  }

  function do_export_custom_column($row, $name) {

    switch($name) {
      case "name":
        return $row["name"];
        break;
    }

  }

  function do_handle_submit($sender_name, $event_name, $event_value) {
    
    global $db;
    global $url;
    switch ($event_name) {
      case "rolldown":
        $_SESSION["rolldown_invoice_task_$event_value"] = !session("rolldown_invoice_task_$event_value", false);
        refresh();
        break;
      case "detach_project":
        global $inv;
        global $dm;
        global $db;
        $query = $db->query("SELECT inp.id".
                            "  FROM invoice_position inp INNER JOIN work wrk    ON inp.work_id    = wrk.id".
                            "                            INNER JOIN task tsk    ON wrk.task_id    = tsk.id".
                            " WHERE inp.invoice_id = ?".
                            "   AND tsk.project_id = ?"
                           ,$this->bind_key()
                           ,$event_value
                           );
        while ($row = $db->next_row($query)) {
          $dm->update("invoice_position", array("invoice_id" => null), $row["id"]);
        }
        $inv->calculate_invoice($this->bind_key());
        $this->submit_handled();
        break;
    }

    return "";
  }

}

?>