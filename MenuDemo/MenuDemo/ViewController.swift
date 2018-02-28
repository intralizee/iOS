//
//  ViewController.swift
//  MenuDemo
//
//  Created by Alizée Wickenheiser on 2/25/18.
//  Copyright © 2018 intralizee. All rights reserved.
//

import UIKit
import SideMenu

class ViewController: UIViewController {
    
    let userViewController:UserViewController = UserViewController()
    let driverViewController:DriverViewController = DriverViewController()

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        let btnMenu: UIButton = UIButton(type: UIButtonType.roundedRect)
        btnMenu.frame = CGRect(x: 8, y: 60, width: 60, height: 60)
        
        btnMenu.setTitle("Menu", for: UIControlState.normal)
        btnMenu.setTitleColor(UIColor.purple, for: UIControlState.normal)
        btnMenu.titleLabel?.font = UIFont.boldSystemFont(ofSize: 18)
        
        btnMenu.addTarget(self, action: #selector(menuBtnPressed(sender:)), for: .touchUpInside)
        self.view.addSubview(btnMenu)
        
        // Define the menus
        let menuLeftNavigationController = UISideMenuNavigationController(rootViewController: userViewController)
        menuLeftNavigationController.title = "yolo"
        // UISideMenuNavigationController is a subclass of UINavigationController, so do any additional configuration
        // of it here like setting its viewControllers. If you're using storyboards, you'll want to do something like:
        // let menuLeftNavigationController = storyboard!.instantiateViewController(withIdentifier: "LeftMenuNavigationController") as! UISideMenuNavigationController
        SideMenuManager.default.menuLeftNavigationController = menuLeftNavigationController
        
        let menuRightNavigationController = UISideMenuNavigationController(rootViewController: driverViewController)
        // UISideMenuNavigationController is a subclass of UINavigationController, so do any additional configuration
        // of it here like setting its viewControllers. If you're using storyboards, you'll want to do something like:
        // let menuRightNavigationController = storyboard!.instantiateViewController(withIdentifier: "RightMenuNavigationController") as! UISideMenuNavigationController
        SideMenuManager.default.menuRightNavigationController = menuRightNavigationController
        
        // Enable gestures. The left and/or right menus must be set up above for these to work.
        // Note that these continue to work on the Navigation Controller independent of the view controller it displays!
        //SideMenuManager.default.menuAddPanGestureToPresent(toView: self.navigationController!.navigationBar)
        //SideMenuManager.default.menuAddScreenEdgePanGesturesToPresent(toView: self.navigationController!.view)
        
    }
    
    @objc func menuBtnPressed(sender:UIButton){
        print("Menu button pressed!")
        
        present(SideMenuManager.default.menuLeftNavigationController!, animated: true, completion: nil)
        
        // Similarly, to dismiss a menu programmatically, you would do this:
        //dismiss(animated: true, completion: nil)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

