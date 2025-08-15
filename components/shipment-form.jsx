"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"

export function ShipmentForm({ shipment, onSave, onCancel, isOpen }) {
  const [formData, setFormData] = useState({
    shipmentName: "",
    status: "Pending",
    isInternational: false,
    basePrice: "",
    weight: "",
    ratePerKg: "",
    destination: "",
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  // Calculate delivery cost
  const deliveryCost =
    formData.basePrice && formData.weight && formData.ratePerKg
      ? Number.parseFloat(formData.basePrice) +
      Number.parseFloat(formData.weight) * Number.parseFloat(formData.ratePerKg)
      : 0

  useEffect(() => {
    if (shipment) {
      setFormData({
        shipmentName: shipment.shipmentName || "",
        status: shipment.status || "Pending",
        isInternational: shipment.isInternational || false,
        basePrice: shipment.basePrice?.toString() || "",
        weight: shipment.weight?.toString() || "",
        ratePerKg: shipment.ratePerKg?.toString() || "",
        destination: shipment.destination || "",
      })
    } else {
      setFormData({
        shipmentName: "",
        status: "Pending",
        isInternational: false,
        basePrice: "",
        weight: "",
        ratePerKg: "",
        destination: "",
      })
    }
    setErrors({})
  }, [shipment, isOpen])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.shipmentName.trim()) newErrors.shipmentName = "Shipment name is required"
    if (!formData.basePrice || Number.parseFloat(formData.basePrice) <= 0) newErrors.basePrice = "Base price must be greater than 0"
    if (!formData.weight || Number.parseFloat(formData.weight) <= 0) newErrors.weight = "Weight must be greater than 0"
    if (!formData.ratePerKg || Number.parseFloat(formData.ratePerKg) <= 0) newErrors.ratePerKg = "Rate per kg must be greater than 0"
    if (!formData.destination.trim()) newErrors.destination = "Destination is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const shipmentData = {
        ...formData,
        basePrice: Number.parseFloat(formData.basePrice),
        weight: Number.parseFloat(formData.weight),
        ratePerKg: Number.parseFloat(formData.ratePerKg),
        deliveryCost: deliveryCost,
        createdAt: shipment?.createdAt || new Date().toISOString().split("T")[0],
        _id: shipment?._id || `SH${String(Date.now()).slice(-3).padStart(3, "0")}`,
      }


      const url = shipment
        ? `${apiBaseUrl}/order/update/${shipment._id}`
        : `${apiBaseUrl}/order/create`
      const method = shipment ? "patch" : "post"
      console.log("url: ",url)
      const response = await axios({
        method,
        url,
        data: shipmentData,
        withCredentials: true,
      })

      console.log("Shipment saved:", response.data)


      // Use response data if backend returns saved shipment
      onSave(response.data || shipmentData)
    } catch (error) {
      console.error("Error saving shipment:", error)
      alert("Failed to save shipment. Please try again.") // optional
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{shipment ? "Edit Shipment" : "Add New Shipment"}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="shipmentName">Shipment Name *</Label>
                <Input
                  id="shipmentName"
                  value={formData.shipmentName}
                  onChange={(e) => handleInputChange("shipmentName", e.target.value)}
                  className={errors.shipmentName ? "border-red-300" : ""}
                  placeholder="Enter shipment name"
                />
                {errors.shipmentName && <p className="text-sm text-red-600 mt-1">{errors.shipmentName}</p>}
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="isInternational"
                  checked={formData.isInternational}
                  onCheckedChange={(checked) => handleInputChange("isInternational", checked)}
                />
                <Label htmlFor="isInternational">International Shipment</Label>
              </div>

              <div>
                <Label htmlFor="basePrice">Base Price ($) *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) => handleInputChange("basePrice", e.target.value)}
                  className={errors.basePrice ? "border-red-300" : ""}
                  placeholder="0.00"
                />
                {errors.basePrice && <p className="text-sm text-red-600 mt-1">{errors.basePrice}</p>}
              </div>

              <div>
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  className={errors.weight ? "border-red-300" : ""}
                  placeholder="0.0"
                />
                {errors.weight && <p className="text-sm text-red-600 mt-1">{errors.weight}</p>}
              </div>

              <div>
                <Label htmlFor="ratePerKg">Rate per Kg ($) *</Label>
                <Input
                  id="ratePerKg"
                  type="number"
                  step="0.01"
                  value={formData.ratePerKg}
                  onChange={(e) => handleInputChange("ratePerKg", e.target.value)}
                  className={errors.ratePerKg ? "border-red-300" : ""}
                  placeholder="0.00"
                />
                {errors.ratePerKg && <p className="text-sm text-red-600 mt-1">{errors.ratePerKg}</p>}
              </div>

              <div>
                <Label htmlFor="deliveryCost">Delivery Cost ($)</Label>
                <Input id="deliveryCost" value={deliveryCost.toFixed(2)} disabled className="bg-gray-50" />
                <p className="text-xs text-gray-500 mt-1">Calculated: Base Price + (Weight x Rate per Kg)</p>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="destination">Destination *</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => handleInputChange("destination", e.target.value)}
                  className={errors.destination ? "border-red-300" : ""}
                  placeholder="Enter destination"
                />
                {errors.destination && <p className="text-sm text-red-600 mt-1">{errors.destination}</p>}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? "Saving..." : shipment ? "Update Shipment" : "Create Shipment"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
