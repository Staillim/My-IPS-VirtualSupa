"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState, useRef } from "react";
import { AtSign, Phone, User, MapPin, Camera, Upload, Eye, File as FileIcon, Trash2, Award, Briefcase, Lock, IdCard } from "lucide-react";
import Link from 'next/link';
import { ImageCropDialog } from "@/components/ui/image-crop-dialog";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { colombianData } from "@/lib/colombia-data";
import { useSupabase } from "@/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const profileSchema = z.object({
  first_name: z.string().min(1, "El nombre es obligatorio"),
  last_name: z.string().min(1, "El apellido es obligatorio"),
  email: z.string().email("Dirección de correo electrónico no válida"),
  phone_number: z.string().min(1, "El número de teléfono es obligatorio"),
  document_type: z.string().optional(),
  document_number: z.string().optional(),
  department_id: z.string().min(1, "El departamento es obligatorio"),
  city_id: z.string().min(1, "La ciudad es obligatoria"),
  address: z.string().optional(),
  age: z.string().optional(),
  blood_type: z.string().optional(),
  allergies: z.string().optional(),
  specialty: z.string().optional(),
  license_number: z.string().optional(),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "La contraseña actual es obligatoria."),
    newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres."),
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"]
});

export default function ProfilePage() {
  const { toast } = useToast();
  const { user, supabase } = useSupabase();
  const [userData, setUserData] = useState<any>(null);
  const [isUserDataLoading, setIsUserDataLoading] = useState(true);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadedDocument, setUploadedDocument] = useState<{name: string; data: string; type: string} | null>(null);
  const [professionalDocument, setProfessionalDocument] = useState<{name: string; data: string; type: string} | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  // Fetch user data
  useEffect(() => {
    console.log('Fetch effect running, user:', user?.id, 'supabase:', !!supabase);
    if (!user?.id || !supabase) {
      console.log('Skipping fetch - no user or supabase');
      setIsUserDataLoading(false);
      return;
    }

    const fetchUserData = async () => {
      console.log('Starting fetch for user:', user.id);
      setIsUserDataLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
      } else {
        console.log('User data fetched successfully:', data);
        setUserData(data);
      }
      setIsUserDataLoading(false);
    };

    fetchUserData();
  }, [user?.id, supabase]);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      document_type: "",
      document_number: "",
      department_id: "",
      city_id: "",
      address: "",
      age: "",
      blood_type: "",
      allergies: "",
      specialty: "",
      license_number: "",
    },
  });
  
   const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    }
  });

  useEffect(() => {
    console.log('Population effect running, userData:', userData);
    if (userData) {
      console.log('Populating form with userData:', userData);
      console.log('userData.city_id from DB:', userData.city_id);
      console.log('userData.department_id from DB:', userData.department_id);
      
      // Si hay un departamento guardado, cargar sus ciudades primero
      if (userData.department_id) {
        const department = colombianData.find(
          (d) => d.id === userData.department_id
        );
        console.log('Found department:', department);
        if (department) {
          const cityOptions = department.cities.sort((a, b) => a.name.localeCompare(b.name));
          console.log('City options loaded:', cityOptions);
          setCities(cityOptions);
          
          // Verificar si la ciudad guardada existe en las opciones
          if (userData.city_id) {
            const cityExists = cityOptions.find(c => c.id === userData.city_id);
            console.log('City exists in options?', cityExists);
          }
        }
      }
      
      // Usar setTimeout para asegurar que las ciudades están en el estado antes del reset
      setTimeout(() => {
        const formData = {
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          phone_number: userData.phone_number || '',
          document_type: userData.document_type || '',
          document_number: userData.document_number || '',
          department_id: userData.department_id || '',
          city_id: userData.city_id || '',
          address: userData.address || '',
          age: userData.age?.toString() || '',
          blood_type: userData.blood_type || '',
          allergies: userData.allergies || '',
          specialty: userData.specialty || "",
          license_number: userData.license_number || "",
        };
        console.log('Form data to reset:', formData);
        console.log('Specifically city_id for form:', formData.city_id);
        form.reset(formData);
        console.log('Form reset complete, current values:', form.getValues());
        console.log('Form city_id after reset:', form.getValues().city_id);
      }, 50);
      
      if(userData.photo_url) {
        setAvatarPreview(userData.photo_url);
      }
      if(userData.document) {
        setUploadedDocument(userData.document);
      }
       if(userData.professional_document) {
        setProfessionalDocument(userData.professional_document);
      }
    } else {
      console.log('No userData to populate');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const selectedDepartment = form.watch("department_id");

  useEffect(() => {
    console.log('Department watcher triggered, selectedDepartment:', selectedDepartment);
    if (selectedDepartment) {
      const department = colombianData.find(
        (d) => d.id === selectedDepartment
      );
      const cityOptions = department ? department.cities.sort((a, b) => a.name.localeCompare(b.name)) : [];
      console.log('Setting cities from watcher:', cityOptions);
      setCities(cityOptions);

      const currentCityId = form.getValues("city_id");
      console.log('Current city_id in form:', currentCityId);
      
      if (department && currentCityId) {
        const cityExists = department.cities.find(c => c.id === currentCityId);
        console.log('Does current city exist in new department?', cityExists);
        if (!cityExists) {
          console.log('City does not belong to this department, clearing city_id');
          form.setValue("city_id", "");
        }
      }
    } else {
        console.log('No department selected, clearing cities');
        setCities([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDepartment]);

  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !supabase) return;

    // Validar tamaño del archivo (máximo 5MB para imágenes de perfil)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      toast({
        variant: 'destructive',
        title: 'Imagen muy grande',
        description: `La imagen no debe superar los 5MB. Tamaño actual: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      });
      event.target.value = ''; // Limpiar el input
      return;
    }

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        variant: 'destructive',
        title: 'Tipo de archivo no válido',
        description: 'Solo se permiten imágenes JPG, PNG, WebP o GIF',
      });
      event.target.value = '';
      return;
    }

    // Leer el archivo y abrir el diálogo de recorte
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImageToCrop(base64String);
      setCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
    
    // Limpiar el input para permitir seleccionar la misma imagen nuevamente
    event.target.value = '';
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    if (!user || !supabase) return;

    setIsUploading(true);
    try {
      // Convertir el blob a base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
        
        try {
          const { error } = await supabase
            .from('users')
            .update({ photo_url: base64String })
            .eq('id', user.id);

          if (error) throw error;

          toast({
            title: "Foto de perfil actualizada",
            description: "Tu nueva foto de perfil ha sido guardada.",
          });
        } catch (error) {
          console.error("Error updating profile picture:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudo actualizar la foto de perfil.",
          });
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(croppedImageBlob);
    } catch (error) {
      console.error("Error processing cropped image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo procesar la imagen recortada.",
      });
      setIsUploading(false);
    }
  };
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'personal' | 'professional') => {
    const file = event.target.files?.[0];
    if (!file || !user || !supabase) return;

    // Validar tamaño del archivo (máximo 10MB para documentos)
    const maxSize = 10 * 1024 * 1024; // 10MB en bytes
    if (file.size > maxSize) {
      toast({
        variant: 'destructive',
        title: 'Archivo muy grande',
        description: `El documento no debe superar los 10MB. Tamaño actual: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      });
      event.target.value = ''; // Limpiar el input
      return;
    }

    // Validar tipo de archivo para documentos
    const validTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];
    if (!validTypes.includes(file.type)) {
      toast({
        variant: 'destructive',
        title: 'Tipo de archivo no válido',
        description: 'Solo se permiten archivos PDF, JPG, PNG o WebP',
      });
      event.target.value = '';
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const docData = { name: file.name, data: base64String, type: file.type };
      
      try {
        const updateField = type === 'personal' ? { document: docData } : { professional_document: docData };
        
        console.log('Uploading document:', { type, fileName: file.name, size: file.size });
        
        const { data, error } = await supabase
          .from('users')
          .update(updateField)
          .eq('id', user.id)
          .select();

        if (error) {
          console.error('Supabase document upload error:', error);
          throw new Error(error.message || 'Error desconocido al subir documento');
        }

        if(type === 'personal') {
          setUploadedDocument(docData);
        } else {
          setProfessionalDocument(docData);
        }
        
        toast({
          title: 'Documento Subido',
          description: `${file.name} se ha subido correctamente.`,
        });
      } catch (error) {
        console.error('Error al subir el documento:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error instanceof Error ? error.message : 'No se pudo subir el documento.',
        });
      }
      
      setIsUploading(false);
    };
    reader.onerror = () => {
        console.error('Error al leer el archivo');
        setIsUploading(false);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'No se pudo leer el archivo.',
        });
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteDocument = async (type: 'personal' | 'professional') => {
    if(!user || !supabase) return;
    
    try {
      const updateField = type === 'personal' ? { document: null } : { professional_document: null };
      const { error } = await supabase
        .from('users')
        .update(updateField)
        .eq('id', user.id);

      if (error) throw error;

      if(type === 'personal') {
        setUploadedDocument(null);
      } else {
        setProfessionalDocument(null);
      }
      
      toast({
        title: 'Documento Eliminado',
        description: 'El documento ha sido eliminado correctamente.',
      });
    } catch (error) {
      console.error('Error al eliminar el documento:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar el documento.',
      });
    }
  }

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    if (!user || !supabase) return;
    
    try {
      console.log('Submitting profile update with values:', values);
      console.log('city_id value:', values.city_id);
      console.log('department_id value:', values.department_id);
      
      // Preparar datos para actualizar
      const dataToUpdate: any = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone_number: values.phone_number,
        document_type: values.document_type || null,
        document_number: values.document_number || null,
        department_id: values.department_id,
        city_id: values.city_id,
        address: values.address || null,
        age: values.age ? parseInt(values.age) : null,
        blood_type: values.blood_type || null,
        allergies: values.allergies || null,
      };

      // Solo agregar campos de personal médico si están presentes
      if (values.specialty) {
        dataToUpdate.specialty = values.specialty;
      }
      if (values.license_number) {
        dataToUpdate.license_number = values.license_number;
      }
      // Nota: attention_methods no existe en el schema de la base de datos
      // Si se necesita, debe agregarse a la tabla users primero

      console.log('Data to update:', dataToUpdate);

      const { data, error } = await supabase
        .from('users')
        .update(dataToUpdate)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          full: error
        });
        throw new Error(error.message || 'Error desconocido al actualizar');
      }

      console.log('Profile updated successfully:', data);
      console.log('Saved city_id:', data?.city_id);
      console.log('Saved department_id:', data?.department_id);

      // Refresh user data
      if (data) {
        setUserData(data);
      }
      
      toast({
        title: "Perfil Actualizado",
        description: "Tu información ha sido guardada exitosamente.",
      });
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo actualizar el perfil.",
      });
    }
  }
  
  async function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    if(!user || !user.email || !supabase) return;

    try {
        // First verify the current password by attempting to sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: values.currentPassword
        });

        if (signInError) {
          throw new Error('Contraseña actual incorrecta');
        }

        // Update password
        const { error: updateError } = await supabase.auth.updateUser({
          password: values.newPassword
        });

        if (updateError) throw updateError;

        toast({
            title: "Contraseña Actualizada",
            description: "Tu contraseña ha sido cambiada exitosamente.",
        });
        passwordForm.reset();
    } catch (error: any) {
         toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "La contraseña actual es incorrecta o ha ocurrido un error.",
        });
    }
  }


  const isPersonalRole = userData?.role === "PERSONAL";
  if (isUserDataLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto py-10">
            <div className="mx-auto max-w-2xl">
                <Skeleton className="h-8 w-1/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-8" />
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="flex justify-end">
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            </div>
        </div>
        </>
    )
  }

  return (
    <>
      <Header />
      <div className="container mx-auto py-10">
        <div className="mx-auto max-w-2xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold font-headline mb-2">Mi Perfil</h1>
            <p className="text-muted-foreground mb-8">
              Ve y administra tu información personal y profesional.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 mb-8">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarPreview || undefined} alt="Foto de perfil" />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full"
                onClick={handleAvatarClick}
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Cambiar foto de perfil</span>
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/gif"
              />
            </div>
            <div className="text-center">
                <h2 className="text-2xl font-bold">{userData?.display_name || `${form.getValues('first_name')} ${form.getValues('last_name')}`}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
                 {isPersonalRole && <Badge className="mt-2">{userData?.specialty || "Sin especialidad"}</Badge>}
            </div>
          </div>


          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Datos Personales
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apellido</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <div className="relative">
                          <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input type="email" className="pl-10" {...field} readOnly />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Teléfono</FormLabel>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input type="tel" className="pl-10" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="document_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Documento</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value || ""} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <IdCard className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Selecciona tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                              <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                              <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                              <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                              <SelectItem value="PEP">Permiso Especial de Permanencia</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="document_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Documento</FormLabel>
                          <div className="relative">
                            <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <FormControl>
                              <Input placeholder="Ej: 1234567890" className="pl-10" {...field} />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Edad</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Ej: 34" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="blood_type"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Grupo Sanguíneo</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="grid grid-cols-4 gap-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="A+" id="a-pos" />
                                <Label htmlFor="a-pos" className="cursor-pointer">A+</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="A-" id="a-neg" />
                                <Label htmlFor="a-neg" className="cursor-pointer">A-</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="B+" id="b-pos" />
                                <Label htmlFor="b-pos" className="cursor-pointer">B+</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="B-" id="b-neg" />
                                <Label htmlFor="b-neg" className="cursor-pointer">B-</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="AB+" id="ab-pos" />
                                <Label htmlFor="ab-pos" className="cursor-pointer">AB+</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="AB-" id="ab-neg" />
                                <Label htmlFor="ab-neg" className="cursor-pointer">AB-</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="O+" id="o-pos" />
                                <Label htmlFor="o-pos" className="cursor-pointer">O+</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="O-" id="o-neg" />
                                <Label htmlFor="o-neg" className="cursor-pointer">O-</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="allergies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alergias Conocidas</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Penicilina" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="department_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Departamento</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value || ""} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Selecciona un departamento" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <ScrollArea className="h-72">
                                {colombianData.map((d) => (
                                  <SelectItem key={d.id} value={d.id}>
                                    {d.department}
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ciudad</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                            defaultValue={field.value}
                            disabled={cities.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Selecciona una ciudad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                               <ScrollArea className="h-72">
                                {cities.map((city) => (
                                  <SelectItem key={city.id} value={city.id}>
                                    {city.name}
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Campo de Dirección */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ej: Calle 123 #45-67, Apto 101" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
            </Card>

            {isPersonalRole && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Briefcase className="h-5 w-5" />
                           Datos Profesionales
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <FormField
                            control={form.control}
                            name="specialty"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>Categoría o Especialidad</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      value={field.value}
                                      className="flex flex-col space-y-2"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Médico general" id="medico-general" />
                                        <Label htmlFor="medico-general" className="cursor-pointer font-normal">Médico general</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Pediatra" id="pediatra" />
                                        <Label htmlFor="pediatra" className="cursor-pointer font-normal">Pediatra</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Psicólogo" id="psicologo" />
                                        <Label htmlFor="psicologo" className="cursor-pointer font-normal">Psicólogo</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Certificador médico" id="certificador" />
                                        <Label htmlFor="certificador" className="cursor-pointer font-normal">Certificador médico</Label>
                                      </div>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="license_number"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Número de Registro Profesional</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: 123456789" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
            )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={form.formState.isSubmitting}
                >
                  Actualizar Perfil
                </Button>
              </div>
            </form>
          </Form>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Mis Documentos
              </CardTitle>
              <CardDescription>
                Sube y administra documentos importantes como tu documento de identidad.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadedDocument ? (
                 <div className="space-y-4">
                  <div className="rounded-lg border bg-muted/20 p-4">
                    {uploadedDocument.type.startsWith('image/') ? (
                      <div className="relative w-full h-96">
                        <Image
                          src={uploadedDocument.data}
                          alt={`Vista previa de ${uploadedDocument.name}`}
                          layout="fill"
                          objectFit="contain"
                          className="rounded-md"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-4">
                         <FileIcon className="h-16 w-16 text-muted-foreground mb-4" />
                         <p className="font-semibold">{uploadedDocument.name}</p>
                         <p className="text-sm text-muted-foreground mb-4">No se puede previsualizar este tipo de archivo.</p>
                         <Button asChild>
                            <Link href={uploadedDocument.data} target="_blank" rel="noopener noreferrer">
                                <Eye className="mr-2 h-4 w-4" /> Ver Documento
                            </Link>
                         </Button>
                      </div>
                    )}
                  </div>
                   <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                        <FileIcon className="h-6 w-6 text-muted-foreground" />
                        <span className="text-sm font-medium truncate max-w-xs">{uploadedDocument.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={uploadedDocument.data} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-5 w-5" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteDocument('personal')}>
                          <Trash2 className="h-5 w-5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted p-8 text-center">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No has subido ningún documento.
                  </p>
                  <Button asChild variant="outline">
                    <label htmlFor="file-upload-personal">
                      {isUploading ? 'Procesando...' : 'Seleccionar Archivo'}
                      <input
                        id="file-upload-personal"
                        name="file-upload-personal"
                        type="file"
                        className="sr-only"
                        onChange={(e) => handleFileUpload(e, 'personal')}
                        disabled={isUploading}
                        accept="image/png, image/jpeg, application/pdf"
                      />
                    </label>
                  </Button>
                </div>
              )}
               <p className="text-xs text-muted-foreground mt-2">
                Archivos permitidos: PDF, PNG, JPG. Tamaño máximo: 5MB.
              </p>
            </CardContent>
          </Card>

          {isPersonalRole && (
             <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Certificación Profesional
                </CardTitle>
                <CardDescription>
                    Sube tu título o tarjeta profesional para completar tu perfil.
                </CardDescription>
                </CardHeader>
                <CardContent>
                {professionalDocument ? (
                 <div className="space-y-4">
                  <div className="rounded-lg border bg-muted/20 p-4">
                    {professionalDocument.type.startsWith('image/') ? (
                      <div className="relative w-full h-96">
                        <Image
                          src={professionalDocument.data}
                          alt={`Vista previa de ${professionalDocument.name}`}
                          layout="fill"
                          objectFit="contain"
                          className="rounded-md"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-4">
                         <FileIcon className="h-16 w-16 text-muted-foreground mb-4" />
                         <p className="font-semibold">{professionalDocument.name}</p>
                         <p className="text-sm text-muted-foreground mb-4">No se puede previsualizar este tipo de archivo.</p>
                         <Button asChild>
                            <Link href={professionalDocument.data} target="_blank" rel="noopener noreferrer">
                                <Eye className="mr-2 h-4 w-4" /> Ver Documento
                            </Link>
                         </Button>
                      </div>
                    )}
                  </div>
                   <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                        <FileIcon className="h-6 w-6 text-muted-foreground" />
                        <span className="text-sm font-medium truncate max-w-xs">{professionalDocument.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={professionalDocument.data} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-5 w-5" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteDocument('professional')}>
                          <Trash2 className="h-5 w-5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted p-8 text-center">
                        <Upload className="h-10 w-10 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            Aún no has subido tu certificación profesional.
                        </p>
                        <Button asChild variant="outline">
                            <label htmlFor="file-upload-professional">
                            {isUploading ? 'Procesando...' : 'Seleccionar Archivo'}
                            <input
                                id="file-upload-professional"
                                name="file-upload-professional"
                                type="file"
                                className="sr-only"
                                onChange={(e) => handleFileUpload(e, 'professional')}
                                disabled={isUploading}
                                accept="image/png, image/jpeg, application/pdf"
                            />
                            </label>
                        </Button>
                    </div>
                 )}
                 <p className="text-xs text-muted-foreground mt-2">
                    Archivos permitidos: PDF, PNG, JPG. Tamaño máximo: 5MB.
                </p>
                </CardContent>
            </Card>
          )}
          
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Seguridad
                </CardTitle>
                <CardDescription>
                    Administra la seguridad de tu cuenta.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                            <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Contraseña Actual</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Nueva Contraseña</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <div className="flex justify-end">
                                <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                                    Cambiar Contraseña
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

        </div>
      </div>

      {/* Image Crop Dialog */}
      {imageToCrop && (
        <ImageCropDialog
          open={cropDialogOpen}
          onOpenChange={setCropDialogOpen}
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
          aspectRatio={1}
          title="Recortar Foto de Perfil"
          description="Ajusta el área de la imagen que deseas usar como foto de perfil (1:1)"
        />
      )}
    </>
  );
}

