//
//  ViewController.swift
//  driveMe
//
//  Created by Alizée Wickenheiser on 2/25/18.
//  Copyright © 2018 intralizee. All rights reserved.
//

import UIKit
import GoogleMaps
import GooglePlaces

class ViewController: UIViewController {

    var mapView: GMSMapView!
    var camera: GMSCameraPosition!
    
    var placesClient: GMSPlacesClient!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        setupGoogleMaps() // Setup Google Maps
        
        setupUserInterface() // Setup User Interface
    }
    
    func setupGoogleMaps() {
        // Create a GMSCameraPosition that tells the map to display the coordinate -33.86,151.20 at zoom level 6.
        camera = GMSCameraPosition.camera(withLatitude: -33.86, longitude: 151.20, zoom: 6.0)
        mapView = GMSMapView.map(withFrame: CGRect.zero, camera: camera)
        view = mapView
        
        // Creates a marker in the center of the map.
        let marker = GMSMarker()
        marker.position = CLLocationCoordinate2D(latitude: -33.86, longitude: 151.20)
        marker.title = "Sydney"
        marker.snippet = "Australia"
        marker.map = mapView
    }
    
    func setupUserInterface() {
        // (1) Menu Button - Creation
        let btnMenu: UIButton = UIButton(type: UIButtonType.roundedRect)
        btnMenu.frame = CGRect(x: 8, y: 60, width: 60, height: 60)
        
        //btnMenu.setTitle("", for: UIControlState.normal)
        //btnMenu.setTitleColor(UIColor.purple, for: UIControlState.normal)
        //btnMenu.titleLabel?.font = UIFont.boldSystemFont(ofSize: 18)
        
        let imgMenu = self.resizeImage(with: UIImage(named: "menu")!, scaledTo: CGSize(width: 45.0, height: 45.0))
        btnMenu.tintColor = UIColor.black
        btnMenu.setImage(imgMenu, for: UIControlState.normal)
        
        btnMenu.addTarget(self, action: #selector(menuBtnPressed(sender:)), for: .touchUpInside)
        self.view.addSubview(btnMenu)
        
        // (2) Where to? Button - Creation
        let btnWhereTo: UIButton = UIButton(type: UIButtonType.roundedRect)
        btnWhereTo.frame = CGRect(x: 20, y: 260, width: UIScreen.main.bounds.width - 40, height: 60)
        btnWhereTo.backgroundColor = UIColor.white
        btnWhereTo.setTitle("\u{2022}   Where to?", for: UIControlState.normal)
        btnWhereTo.setTitleColor(UIColor.black, for: UIControlState.normal)
        btnWhereTo.titleLabel?.font = UIFont.boldSystemFont(ofSize: 18)

        btnWhereTo.contentHorizontalAlignment = .left
        btnWhereTo.contentVerticalAlignment = .top
        btnWhereTo.titleEdgeInsets = UIEdgeInsetsMake(20.0, 15.0, 0.0, 0.0)

        //let image = UIImage(named: "car")
        let image = self.resizeImage(with: UIImage(named: "car")!, scaledTo: CGSize(width: 35.0, height: 35.0))
        btnWhereTo.tintColor = UIColor.black
        btnWhereTo.setImage(image, for: UIControlState.normal)
        btnWhereTo.semanticContentAttribute = .forceRightToLeft
        btnWhereTo.imageEdgeInsets = UIEdgeInsetsMake(12, btnWhereTo.frame.size.width - ((image.size.width) + 30), 0, 0)
        
        // Add transparency shadow to Button.
        btnWhereTo.layer.shadowRadius = 16.0
        btnWhereTo.layer.shadowColor = UIColor.black.cgColor
        btnWhereTo.layer.shadowOffset = CGSize(width: 0.0, height: 1.0)
        btnWhereTo.layer.shadowOpacity = 0.3
        btnWhereTo.layer.masksToBounds = false
        
        btnWhereTo.addTarget(self, action: #selector(menuBtnPressed(sender:)), for: .touchUpInside)
        self.view.addSubview(btnWhereTo)
        
    }
    
    @objc func menuBtnPressed(sender:UIButton){
        print("Menu button pressed!")
        let autocompleteController = GMSAutocompleteViewController()
        autocompleteController.delegate = self
        present(autocompleteController, animated: true, completion: nil)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

extension ViewController: GMSAutocompleteViewControllerDelegate {
    
    // Handle the user's selection.
    func viewController(_ viewController: GMSAutocompleteViewController, didAutocompleteWith place: GMSPlace) {
        print("Place ID: \(place.placeID)")
        print("Place name: \(place.name)")
        print("Place address: \(String(describing: place.formattedAddress))")
        print("Place coordinate: \(place.coordinate)")
        print("Place attributions: \(String(describing: place.attributions))")
        dismiss(animated: true, completion: nil)
        
        if (!place.placeID.isEmpty) {
            let marker = GMSMarker()
        
            marker.position = CLLocationCoordinate2D(latitude: place.coordinate.latitude, longitude: place.coordinate.longitude)
            marker.title = place.name
            marker.snippet = place.formattedAddress
            marker.map = mapView
            let location = GMSCameraPosition.camera(withTarget: place.coordinate, zoom: 15) // use 10 for default load
            mapView.animate(to: location)
            //mapView.camera = location
            
        }
    }
    
    func viewController(_ viewController: GMSAutocompleteViewController, didFailAutocompleteWithError error: Error) {
        // TODO: handle the error.
        print("Error: ", error.localizedDescription)
    }
    
    // User canceled the operation.
    func wasCancelled(_ viewController: GMSAutocompleteViewController) {
        dismiss(animated: true, completion: nil)
    }
    
    // Turn the network activity indicator on and off again.
    func didRequestAutocompletePredictions(_ viewController: GMSAutocompleteViewController) {
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
    }
    
    func didUpdateAutocompletePredictions(_ viewController: GMSAutocompleteViewController) {
        UIApplication.shared.isNetworkActivityIndicatorVisible = false
    }
    
    func resizeImage(with image: UIImage, scaledTo newSize: CGSize) -> UIImage {
        UIGraphicsBeginImageContext(newSize)
        image.draw(in: CGRect(x: 0, y: 0, width: newSize.width, height: newSize.height))
        let newImage: UIImage? = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        return newImage ?? UIImage()
    }
}

extension UIImage {
    static func from(color: UIColor) -> UIImage {
        let rect = CGRect(x: 0, y: 0, width: 50, height: 50)
        UIGraphicsBeginImageContext(rect.size)
        let context = UIGraphicsGetCurrentContext()
        context!.setFillColor(color.cgColor)
        context!.fill(rect)
        let img = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        return img!
    }
}

