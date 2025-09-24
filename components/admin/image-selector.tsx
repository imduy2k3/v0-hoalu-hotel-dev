"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { X, Plus, ExternalLink } from "lucide-react"

interface ImageSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectImage: (imageUrl: string) => void
  currentImages: string[]
}

const availableImages = [
  "hotel-exterior.jpg",
  "reception.jpg",
  "logo.png",
  "z6716140579973_3970acdaff58f36adaa6ef920b53424f.jpg",
  "z6716141199030_a21de5b69a0670805d420922de10281e.jpg",
  "z6716141199039_162b586711c901cb2920c92dc0f3052c.jpg",
  "z6716141199040_0d44d8a1e00ddeb2d198393e8621a98b.jpg",
  "z6716141199041_20430d37f01bef75c633707cb848672c.jpg",
  "z6716141199042_b665844bf13287706cba0013b8cb5c55.jpg",
  "z6716141199044_8ac47024d363ff5dbc2b6e9f7a4a7671.jpg",
  "z6716141199045_b8c08040c6caea6bf7155fae1ff4efe5.jpg",
  "z6716141199046_56ad40f6ddb9f764cf786dceac9a12d5.jpg",
  "z6716141199048_6b4f1478a1fe31ce029d379afc2b6987.jpg",
  "z6716141199049_4094b2cd6d3880d56296907593bcacd9.jpg",
  "z6716141199050_2d4eb36193288a292d1f54f69d8cbb56.jpg",
  "z6716141199051_a0c8361b05fbea907920155ccf052f02.jpg",
  "z6716141199052_bbf0e2874f80f5c2b042b1eaae3b536f.jpg",
  "z6716141199053_82ed50b2ed8a9fdf3117fa4e6ef0170f.jpg",
  "z6716141199060_3a96c1c5940b1a12843160032ee72b03.jpg",
  "z6716141199063_6f2d15a14229f6fdff5f0d3c12871e39.jpg",
  "z6716141199064_4ed3cd625c046a0f4be3f380f3541392.jpg",
  "z6716141199066_a1f32b26a4cfc434ec1ffddfcd672a9b.jpg",
  "z6716141210419_4ad7142967335a6dc80ea8909fef7f11.jpg",
  "z6716141210420_762e6e8e1364ec7443a6bae1cf7e38c7.jpg",
  "z6716141210421_e0ec3c75f2beb874dc60a7a20078c7cf.jpg",
  "z6716141210422_682e50263a06b45342ba441b5858742f.jpg",
  "z6716141210423_60e0242dfb68f93ecf1379e597b6749e.jpg",
  "z6716141210424_a3f8731c998d4dab4045ecede2c1e687.jpg",
  "z6716141210425_78eb11f931ee63bff479080e581d4c6f.jpg",
  "z6716141210427_5465b21560cf79051f816b6bc267c6cb.jpg",
  "z6716141210428_330c680596fe933e3e735188f518890c.jpg",
  "z6716141210430_8c5aadb458ac80bb37f65a270b18d3fb.jpg",
  "z6716141210432_cd5ad464607daf554b2de5db9c63a888.jpg",
  "z6716141210437_b8e843fbaaa85748d90f655101fec6f1.jpg",
  "z6716141210438_91f60698bba9fa71e3c77c350392458d.jpg",
  "z6716141210440_0c0b89f5840e67e029aace524aab11dc.jpg",
  "z6716141210441_1bb8bcd816f583ac77a943b9d90e8d68.jpg",
  "z6716141210443_128c629a5f3a278ef788a2533bf2008e.jpg",
  "z6716141210451_98d4b5b24276541c59645b9a20c95b65.jpg",
  "z6716141210459_1ef31243fe6913d3f6663a210f71d557.jpg",
  "z6716141210460_771cb1a120f0c09d7ca85af079f8593d.jpg",
  "z6716141210461_275e894070747b090c61c62ee7024c11.jpg",
  "z6716141210462_c15ca94c895a0df80fc87e47b70d109d.jpg",
  "z6716141210463_ee54e2c77e4b060996e560fd91070f52.jpg",
  "z6716141210466_cc21cc4ea60d006e7c66ed6a4a36bd61.jpg",
  "z6716141210468_285d9a096debd081b4baea450e04fb0a.jpg",
  "z6716141216065_244add9072bfeca366a0e97008c33778.jpg",
  "z6716141216066_3772ddb9fd7a624cef7a0d454f92406c.jpg",
  "z6716141216067_13cb699d0f3e3602f5358abfc6d700bd.jpg",
  "z6716141216068_0f32e566d9c9c5c1ea93a4f98bec21fa.jpg",
  "z6716141216069_941d11e7e26615dfcd60321e0fd68284.jpg"
]

export function ImageSelector({ isOpen, onClose, onSelectImage, currentImages }: ImageSelectorProps) {
  const [externalUrl, setExternalUrl] = useState("")
  const [showExternalInput, setShowExternalInput] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleSelectLocalImage = (imageName: string) => {
    const imageUrl = `/images/${imageName}`
    onSelectImage(imageUrl)
    onClose()
  }

  const handleAddExternalImage = () => {
    if (externalUrl.trim()) {
      onSelectImage(externalUrl.trim())
      setExternalUrl("")
      setShowExternalInput(false)
      onClose()
    }
  }

  // Filter images based on search term
  const filteredImages = availableImages.filter(imageName =>
    imageName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full w-[98vw] h-[98vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chọn ảnh cho loại phòng</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* External URL Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Thêm ảnh từ URL bên ngoài</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowExternalInput(!showExternalInput)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {showExternalInput ? "Ẩn" : "Hiện"}
              </Button>
            </div>
            
            {showExternalInput && (
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={handleAddExternalImage}
                  disabled={!externalUrl.trim()}
                >
                  Thêm
                </Button>
              </div>
            )}
          </div>

          {/* Available Images Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-lg font-medium">
                Ảnh có sẵn trong thư mục ({filteredImages.length}/{availableImages.length} ảnh)
              </Label>
              <Input
                placeholder="Tìm kiếm ảnh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {filteredImages.map((imageName) => {
                const imageUrl = `/images/${imageName}`
                const isSelected = currentImages.includes(imageUrl)
                
                return (
                  <Card 
                    key={imageName} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                      isSelected ? 'ring-2 ring-hotel-gold bg-hotel-gold/5' : ''
                    }`}
                    onClick={() => handleSelectLocalImage(imageName)}
                  >
                    <CardContent className="p-3">
                      <div className="relative aspect-square">
                        <img
                          src={imageUrl}
                          alt={imageName}
                          className="w-full h-full object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.jpg"
                            e.currentTarget.alt = "Ảnh không tải được"
                          }}
                        />
                        {isSelected && (
                          <div className="absolute top-3 right-3 bg-hotel-gold text-white rounded-full p-1">
                            <X className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Current Images */}
          {currentImages.length > 0 && (
            <div>
              <Label className="text-lg font-medium mb-4 block">Ảnh hiện tại ({currentImages.length} ảnh)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {currentImages.map((imageUrl, index) => (
                  <Card key={index} className="relative">
                    <CardContent className="p-3">
                      <div className="relative aspect-square">
                        <img
                          src={imageUrl}
                          alt={`Ảnh ${index + 1}`}
                          className="w-full h-full object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.jpg"
                            e.currentTarget.alt = "Ảnh không tải được"
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
