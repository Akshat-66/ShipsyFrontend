"use client"

import { useState, useMemo } from "react"
import { AuthGuard, useAuth } from "@/components/auth-guard"
import { ShipmentForm } from "@/components/shipment-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AIChatbot from "@/components/ai-chatbot"
import {
  Truck,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  LogOut,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

// Mock shipment data
const initialShipments = [
  {
    id: "SH001",
    shipmentName: "Electronics Batch A",
    status: "In Transit",
    isInternational: true,
    basePrice: 150,
    weight: 25,
    ratePerKg: 5,
    deliveryCost: 275,
    createdAt: "2024-01-15",
    destination: "New York, USA",
  },
  {
    id: "SH002",
    shipmentName: "Medical Supplies",
    status: "Delivered",
    isInternational: false,
    basePrice: 200,
    weight: 15,
    ratePerKg: 8,
    deliveryCost: 320,
    createdAt: "2024-01-14",
    destination: "Los Angeles, CA",
  },
  {
    id: "SH003",
    shipmentName: "Automotive Parts",
    status: "Pending",
    isInternational: true,
    basePrice: 300,
    weight: 50,
    ratePerKg: 6,
    deliveryCost: 600,
    createdAt: "2024-01-13",
    destination: "Toronto, Canada",
  },
  {
    id: "SH004",
    shipmentName: "Fashion Items",
    status: "In Transit",
    isInternational: false,
    basePrice: 100,
    weight: 10,
    ratePerKg: 4,
    deliveryCost: 140,
    createdAt: "2024-01-12",
    destination: "Chicago, IL",
  },
  {
    id: "SH005",
    shipmentName: "Books Collection",
    status: "Cancelled",
    isInternational: false,
    basePrice: 80,
    weight: 20,
    ratePerKg: 3,
    deliveryCost: 140,
    createdAt: "2024-01-11",
    destination: "Miami, FL",
  },
  {
    id: "SH006",
    shipmentName: "Tech Gadgets",
    status: "Delivered",
    isInternational: true,
    basePrice: 250,
    weight: 12,
    ratePerKg: 7,
    deliveryCost: 334,
    createdAt: "2024-01-10",
    destination: "London, UK",
  },
  {
    id: "SH007",
    shipmentName: "Home Appliances",
    status: "In Transit",
    isInternational: false,
    basePrice: 400,
    weight: 35,
    ratePerKg: 5,
    deliveryCost: 575,
    createdAt: "2024-01-09",
    destination: "Seattle, WA",
  },
  {
    id: "SH008",
    shipmentName: "Sports Equipment",
    status: "Pending",
    isInternational: true,
    basePrice: 180,
    weight: 28,
    ratePerKg: 4,
    deliveryCost: 292,
    createdAt: "2024-01-08",
    destination: "Sydney, Australia",
  },
]

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [shipments, setShipments] = useState(initialShipments)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedShipment, setSelectedShipment] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingShipment, setEditingShipment] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [shipmentToDelete, setShipmentToDelete] = useState(null)
  const [notification, setNotification] = useState(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const shipmentsPerPage = 5

  const filteredAndSortedShipments = useMemo(() => {
    let filtered = shipments

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (shipment) =>
          shipment.shipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shipment.destination.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((shipment) => shipment.status === statusFilter)
    }

    // Apply type filter
    if (typeFilter !== "all") {
      const isInternational = typeFilter === "international"
      filtered = filtered.filter((shipment) => shipment.isInternational === isInternational)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case "createdAt":
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        case "deliveryCost":
          aValue = a.deliveryCost
          bValue = b.deliveryCost
          break
        case "shipmentName":
          aValue = a.shipmentName.toLowerCase()
          bValue = b.shipmentName.toLowerCase()
          break
        default:
          return 0
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [shipments, searchQuery, statusFilter, typeFilter, sortBy, sortOrder])

  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return []

    const suggestions = new Set()
    const query = searchQuery.toLowerCase()

    shipments.forEach((shipment) => {
      if (shipment.shipmentName.toLowerCase().includes(query)) {
        suggestions.add(shipment.shipmentName)
      }
      if (shipment.id.toLowerCase().includes(query)) {
        suggestions.add(shipment.id)
      }
      if (shipment.destination.toLowerCase().includes(query)) {
        suggestions.add(shipment.destination)
      }
    })

    return Array.from(suggestions).slice(0, 5)
  }, [searchQuery, shipments])

  const totalPages = Math.ceil(filteredAndSortedShipments.length / shipmentsPerPage)
  const indexOfLastShipment = currentPage * shipmentsPerPage
  const indexOfFirstShipment = indexOfLastShipment - shipmentsPerPage
  const currentShipments = filteredAndSortedShipments.slice(indexOfFirstShipment, indexOfLastShipment)

  const stats = {
    total: filteredAndSortedShipments.length,
    inTransit: filteredAndSortedShipments.filter((s) => s.status === "In Transit").length,
    delivered: filteredAndSortedShipments.filter((s) => s.status === "Delivered").length,
    pending: filteredAndSortedShipments.filter((s) => s.status === "Pending").length,
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  const handleSearchChange = (value) => {
    setSearchQuery(value)
    setShowSuggestions(value.length >= 2)
    handleFilterChange()
  }

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion)
    setShowSuggestions(false)
    handleFilterChange()
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
    handleFilterChange()
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setTypeFilter("all")
    setSortBy("createdAt")
    setSortOrder("desc")
    setCurrentPage(1)
    setShowSuggestions(false)
  }

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const getStatusBadge = (status) => {
    const variants = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      "In Transit": "bg-blue-100 text-blue-800 border-blue-200",
      Delivered: "bg-green-100 text-green-800 border-green-200",
      Cancelled: "bg-red-100 text-red-800 border-red-200",
    }

    return <Badge className={`${variants[status]} border`}>{status}</Badge>
  }

  const handlePreview = (shipment) => {
    setSelectedShipment(shipment)
    setShowPreviewModal(true)
  }

  const handleAddNew = () => {
    setEditingShipment(null)
    setShowForm(true)
  }

  const handleEdit = (shipment) => {
    setEditingShipment(shipment)
    setShowForm(true)
    setShowPreviewModal(false)
  }

  const handleSaveShipment = (shipmentData) => {
    if (editingShipment) {
      setShipments((prev) =>
        prev.map((s) => (s.id === editingShipment.id ? { ...shipmentData, id: editingShipment.id } : s)),
      )
      showNotification("Shipment updated successfully!")
    } else {
      setShipments((prev) => [shipmentData, ...prev])
      showNotification("Shipment created successfully!")
    }

    setShowForm(false)
    setEditingShipment(null)
  }

  const handleDeleteClick = (shipment) => {
    setShipmentToDelete(shipment)
    setShowDeleteConfirm(true)
    setShowPreviewModal(false)
  }

  const handleConfirmDelete = () => {
    if (shipmentToDelete) {
      setShipments((prev) => prev.filter((s) => s.id !== shipmentToDelete.id))
      showNotification("Shipment deleted successfully!")

      const newTotalPages = Math.ceil((filteredAndSortedShipments.length - 1) / shipmentsPerPage)
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages)
      }
    }
    setShowDeleteConfirm(false)
    setShipmentToDelete(null)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {notification && (
          <div className="fixed top-4 right-4 z-50">
            <Alert
              className={`${notification.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
            >
              <AlertDescription className={notification.type === "success" ? "text-green-700" : "text-red-700"}>
                {notification.message}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Truck className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Shipsy Dashboard</h1>
                  <p className="text-sm text-gray-600">Welcome back, {user?.username}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Shipment
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Shipments</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">In Transit</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.inTransit}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Delivered</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <CardTitle>Shipments</CardTitle>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search with suggestions */}
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search shipments..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onFocus={() => setShowSuggestions(searchQuery.length >= 2)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        className="pl-10 w-64"
                      />
                    </div>

                    {/* Search suggestions */}
                    {showSuggestions && searchSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
                        {searchSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Status filter */}
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => {
                      setStatusFilter(value)
                      handleFilterChange()
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Transit">In Transit</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Type filter */}
                  <Select
                    value={typeFilter}
                    onValueChange={(value) => {
                      setTypeFilter(value)
                      handleFilterChange()
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                      <SelectItem value="domestic">Domestic</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Clear filters */}
                  {(searchQuery ||
                    statusFilter !== "all" ||
                    typeFilter !== "all" ||
                    sortBy !== "createdAt" ||
                    sortOrder !== "desc") && (
                    <Button variant="outline" onClick={clearFilters} size="sm">
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("shipmentName")}
                          className="h-auto p-0 font-medium hover:bg-transparent"
                        >
                          Shipment Name {getSortIcon("shipmentName")}
                        </Button>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("deliveryCost")}
                          className="h-auto p-0 font-medium hover:bg-transparent"
                        >
                          Delivery Cost {getSortIcon("deliveryCost")}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("createdAt")}
                          className="h-auto p-0 font-medium hover:bg-transparent"
                        >
                          Created {getSortIcon("createdAt")}
                        </Button>
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentShipments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No shipments found matching your criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentShipments.map((shipment) => (
                        <TableRow key={shipment.id}>
                          <TableCell className="font-medium">{shipment.id}</TableCell>
                          <TableCell>{shipment.shipmentName}</TableCell>
                          <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                          <TableCell>
                            <Badge variant={shipment.isInternational ? "default" : "secondary"}>
                              {shipment.isInternational ? "International" : "Domestic"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">${shipment.deliveryCost}</TableCell>
                          <TableCell>{shipment.createdAt}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handlePreview(shipment)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(shipment)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteClick(shipment)} className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {filteredAndSortedShipments.length > 0 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700">
                    Showing {indexOfFirstShipment + 1} to{" "}
                    {Math.min(indexOfLastShipment, filteredAndSortedShipments.length)} of{" "}
                    {filteredAndSortedShipments.length} shipments
                    {(searchQuery || statusFilter !== "all" || typeFilter !== "all") && (
                      <span className="text-blue-600"> (filtered from {shipments.length} total)</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "bg-blue-600 hover:bg-blue-700" : ""}
                      >
                        {page}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {showPreviewModal && selectedShipment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Shipment Details</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowPreviewModal(false)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Shipment ID</label>
                    <p className="text-lg font-semibold">{selectedShipment.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedShipment.status)}</div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Shipment Name</label>
                  <p className="text-lg">{selectedShipment.shipmentName}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Destination</label>
                  <p className="text-lg">{selectedShipment.destination}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Type</label>
                    <p className="text-lg">{selectedShipment.isInternational ? "International" : "Domestic"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Weight</label>
                    <p className="text-lg">{selectedShipment.weight} kg</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Base Price</label>
                    <p className="text-lg font-semibold">${selectedShipment.basePrice}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Rate per Kg</label>
                    <p className="text-lg">${selectedShipment.ratePerKg}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Total Cost</label>
                    <p className="text-xl font-bold text-blue-600">${selectedShipment.deliveryCost}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Created Date</label>
                  <p className="text-lg">{selectedShipment.createdAt}</p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex space-x-3">
                    <Button onClick={() => handleEdit(selectedShipment)} className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Shipment
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteClick(selectedShipment)}
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Shipment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <ShipmentForm
          shipment={editingShipment}
          onSave={handleSaveShipment}
          onCancel={() => {
            setShowForm(false)
            setEditingShipment(null)
          }}
          isOpen={showForm}
        />

        {showDeleteConfirm && shipmentToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-red-600">Confirm Delete</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete shipment "{shipmentToDelete.shipmentName}"? This action cannot be
                  undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleConfirmDelete}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <AIChatbot />
      </div>
    </AuthGuard>
  )
}
